<?php
// 1. Session so konfigurieren, dass sie 30 Tage hält
$lifetime = 60 * 60 * 24 * 30; // 30 Tage in Sekunden
session_set_cookie_params($lifetime);
ini_set('session.gc_maxlifetime', $lifetime);
session_start();

header('Content-Type: application/json; charset=utf-8');

// 2. Funktion zum Laden der .env Datei
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $_ENV[trim($name)] = trim(trim($value), '"\'');
        }
    }
}

// .env Datei laden (liegt eine Ebene über dem aktuellen Verzeichnis)
loadEnv(dirname(__DIR__) . '/.env');
$admin_password = $_ENV['ADMIN_PASSWORD'];

// 3. SQLite Datenbank initialisieren (Datei wird im Hauptordner erstellt)
try {
    $db_path = dirname(__DIR__) . '/tastaturspiel.sqlite';
    $db = new PDO('sqlite:' . $db_path);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
        spm INTEGER,
        errors INTEGER,
        time INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Falls die Datenbank schon existiert, fügen wir die neuen Spalten leise hinzu
    try { $db->exec("ALTER TABLE scores ADD COLUMN spm INTEGER"); } catch (Exception $e) {}
    try { $db->exec("ALTER TABLE scores ADD COLUMN time INTEGER"); } catch (Exception $e) {}

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

        $stmt = $db->prepare("SELECT email FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email bereits registriert.']);
            exit;
        }

        $stmt = $db->prepare("SELECT username FROM users WHERE LOWER(username) = LOWER(?)");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Username bereits vergeben.']);
            exit;
        }

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

    // USERNAME ÄNDERN
    if ($action === 'change_username') {
        if (!isset($_SESSION['user'])) {
            echo json_encode(['success' => false, 'message' => 'Nicht eingeloggt.']);
            exit;
        }
        $new_username = htmlspecialchars(trim($data['new_username']));
        $old_username = $_SESSION['user'];

        if (empty($new_username)) {
            echo json_encode(['success' => false, 'message' => 'Username darf nicht leer sein.']);
            exit;
        }

        $stmt = $db->prepare("SELECT username FROM users WHERE LOWER(username) = LOWER(?)");
        $stmt->execute([$new_username]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Username ist bereits vergeben.']);
            exit;
        }

        // Username in beiden Tabellen aktualisieren
        $stmt = $db->prepare("UPDATE users SET username = ? WHERE username = ?");
        $stmt->execute([$new_username, $old_username]);

        $stmt = $db->prepare("UPDATE scores SET username = ? WHERE username = ?");
        $stmt->execute([$new_username, $old_username]);

        $_SESSION['user'] = $new_username;
        echo json_encode(['success' => true, 'new_username' => $new_username]);
        exit;
    }

    // RESULTAT SPEICHERN
    if ($action === 'save_score') {
        if (!isset($_SESSION['user'])) {
            echo json_encode(['success' => false, 'message' => 'Nicht eingeloggt.']);
            exit;
        }

        $stmt = $db->prepare("INSERT INTO scores (username, lesson, mode, score, apm, spm, errors, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_SESSION['user'],
            $data['lesson'],
            $data['mode'],
            (int)$data['score'],
            (int)$data['apm'],
            (int)$data['spm'],
            (int)$data['errors'],
            (int)$data['time']
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

    if ($action === 'check_auth') {
        if (isset($_SESSION['user'])) {
            setcookie(session_name(), session_id(), time() + $lifetime, "/");
            echo json_encode(['logged_in' => true, 'username' => $_SESSION['user']]);
        } else {
            echo json_encode(['logged_in' => false]);
        }
        exit;
    }

    if ($action === 'logout') {
        session_destroy();
        setcookie(session_name(), '', time() - 3600, "/");
        echo json_encode(['success' => true]);
        exit;
    }

    // RANGLISTE LADEN (Top 10 nach SPM)
    if ($action === 'get_leaderboard') {
        $lesson = $_GET['lesson'] ?? '';
        $mode = $_GET['mode'] ?? '';

        $stmt = $db->prepare("
            SELECT username, MAX(spm) as spm, MAX(apm) as apm 
            FROM scores 
            WHERE lesson = ? AND mode = ? 
            GROUP BY username 
            ORDER BY spm DESC, apm DESC 
            LIMIT 10
        ");
        $stmt->execute([$lesson, $mode]);
        $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($leaderboard);
        exit;
    }
}
?>
