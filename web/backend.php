<?php
// 1. Session so konfigurieren, dass sie 30 Tage hält
$lifetime = 60 * 60 * 24 * 30; // 30 Tage in Sekunden
session_set_cookie_params($lifetime);
ini_set('session.gc_maxlifetime', $lifetime);
session_start();

header('Content-Type: application/json; charset=utf-8');

// 2. Funktion zum Laden der .env Datei
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;

        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            $value = trim($value, '"\'');
            $_ENV[$name] = $value;
        }
    }
}

// .env Datei laden (liegt im gleichen Verzeichnis)
loadEnv(dirname(__DIR__) . '/.env');

$admin_password = $_ENV['ADMIN_PASSWORD'];

// 3. SQLite Datenbank initialisieren (Datei wird automatisch erstellt)
try {
    $db = new PDO('sqlite:tastaturspiel.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Tabellen erstellen, falls sie noch nicht existieren
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        lesson TEXT,
        mode TEXT,
        score INTEGER,
        apm INTEGER,
        errors INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // REGISTRIERUNG
    if ($action === 'register') {
        $email = trim(strtolower($data['email']));
        $username = trim($data['username']);
        $password = $data['password'];

        if (!preg_match('/@(schulegl\.ch|stud\.schulegl\.ch)$/i', $email)) {
            echo json_encode(['success' => false, 'message' => 'Nur @schulegl.ch oder @stud.schulegl.ch erlaubt.']);
            exit;
        }

        // Prüfen ob Email existiert
        $stmt = $db->prepare("SELECT email FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email bereits registriert.']);
            exit;
        }

        // Prüfen ob Username existiert
        $stmt = $db->prepare("SELECT username FROM users WHERE LOWER(username) = LOWER(?)");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Username bereits vergeben.']);
            exit;
        }

        // User anlegen
        $stmt = $db->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
        $stmt->execute([$email, htmlspecialchars($username), password_hash($password, PASSWORD_DEFAULT)]);

        echo json_encode(['success' => true]);
        exit;
    }

    // LOGIN
    if ($action === 'login') {
        $email = trim(strtolower($data['email']));
        $password = $data['password'];

        $stmt = $db->prepare("SELECT username, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user'] = $user['username'];
            echo json_encode(['success' => true, 'username' => $_SESSION['user']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Falsche Zugangsdaten.']);
        }
        exit;
    }

    // RESULTAT SPEICHERN
    if ($action === 'save_score') {
        if (!isset($_SESSION['user'])) {
            echo json_encode(['success' => false, 'message' => 'Nicht eingeloggt.']);
            exit;
        }

        $stmt = $db->prepare("INSERT INTO scores (username, lesson, mode, score, apm, errors) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_SESSION['user'],
            $data['lesson'],
            $data['mode'],
            (int)$data['score'],
            (int)$data['apm'],
            (int)$data['errors']
        ]);

        echo json_encode(['success' => true]);
        exit;
    }

    // ADMIN LOGIN
    if ($action === 'admin_login') {
        if ($data['password'] === $admin_password) {
            $stmt = $db->query("SELECT * FROM scores ORDER BY id DESC LIMIT 500");
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'scores' => $scores]);
        } else {
            echo json_encode(['success' => false]);
        }
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // AUTH PRÜFEN
    if ($action === 'check_auth') {
        if (isset($_SESSION['user'])) {
            // Cookie-Lebensdauer bei jedem Besuch erneuern
            setcookie(session_name(), session_id(), time() + $lifetime, "/");
            echo json_encode(['logged_in' => true, 'username' => $_SESSION['user']]);
        } else {
            echo json_encode(['logged_in' => false]);
        }
        exit;
    }

    // LOGOUT
    if ($action === 'logout') {
        session_destroy();
        // Cookie löschen
        setcookie(session_name(), '', time() - 3600, "/");
        echo json_encode(['success' => true]);
        exit;
    }

    // RANGLISTE LADEN (Top 10)
    if ($action === 'get_leaderboard') {
        $lesson = $_GET['lesson'] ?? '';
        $mode = $_GET['mode'] ?? '';

        // Holt das beste Resultat pro User für dieses Level, sortiert nach Score (absteigend) und APM (absteigend)
        $stmt = $db->prepare("
            SELECT username, MAX(score) as score, MAX(apm) as apm 
            FROM scores 
            WHERE lesson = ? AND mode = ? 
            GROUP BY username 
            ORDER BY score DESC, apm DESC 
            LIMIT 10
        ");
        $stmt->execute([$lesson, $mode]);
        $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($leaderboard);
        exit;
    }
}
?>
