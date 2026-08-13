<?php
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

loadEnv(dirname(__DIR__) . '/.env');
$admin_password = $_ENV['ADMIN_PASSWORD'];
$is_local = (isset($_ENV['ENVIRONMENT']) && strtolower($_ENV['ENVIRONMENT']) === 'local');

// Session konfigurieren (30 Tage Lebensdauer)
$lifetime = 60 * 60 * 24 * 30;

$cookieParams = [
    'lifetime' => $lifetime,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Strict'
];

if (!$is_local) {
    $cookieParams['secure'] = true;
}

session_set_cookie_params($cookieParams);
ini_set('session.gc_maxlifetime', $lifetime);
session_start();
header('Content-Type: application/json; charset=utf-8');

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

    try { $db->exec("ALTER TABLE scores ADD COLUMN spm INTEGER"); } catch (Exception $e) {}
    try { $db->exec("ALTER TABLE scores ADD COLUMN time INTEGER"); } catch (Exception $e) {}

    try { $db->exec("ALTER TABLE users ADD COLUMN reset_token TEXT"); } catch (Exception $e) {}
    try { $db->exec("ALTER TABLE users ADD COLUMN reset_expiry TEXT"); } catch (Exception $e) {}

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // --- REGULÄRE USER FUNKTIONEN --- //
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
            sleep(4);
            echo json_encode(['success' => false, 'message' => 'Falsche Zugangsdaten.']);
        }
        exit;
    }

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

        $stmt = $db->prepare("UPDATE users SET username = ? WHERE username = ?");
        $stmt->execute([$new_username, $old_username]);

        $stmt = $db->prepare("UPDATE scores SET username = ? WHERE username = ?");
        $stmt->execute([$new_username, $old_username]);

        $_SESSION['user'] = $new_username;
        echo json_encode(['success' => true, 'new_username' => $new_username]);
        exit;
    }

    if ($action === 'save_score') {
        if (!isset($_SESSION['user'])) {
            echo json_encode(['success' => false, 'message' => 'Nicht eingeloggt.']);
            exit;
        }

        if ((int)$data['apm'] > 1200 || (int)$data['spm'] > 1200 || (int)$data['score'] < 0) {
            echo json_encode(['success' => true, 'cheater' => true]);
            exit;
        }

        $stmt = $db->prepare("INSERT INTO scores (username, lesson, mode, score, apm, spm, errors, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_SESSION['user'], $data['lesson'], $data['mode'],
            (int)$data['score'], (int)$data['apm'], (int)$data['spm'],
            (int)$data['errors'], (int)$data['time']
        ]);

        echo json_encode(['success' => true]);
        exit;
    }

    // --- PASSWORT RESET (DURCH SCHÜLER AUF RESET.HTML) --- //
    if ($action === 'reset_password') {
        $token = $data['token'] ?? '';
        $new_pw = $data['new_password'] ?? '';

        if (empty($token) || empty($new_pw)) {
            echo json_encode(['success' => false, 'message' => 'Fehlende Daten.']);
            exit;
        }

        $now = date('Y-m-d H:i:s');
        $stmt = $db->prepare("SELECT email FROM users WHERE reset_token = ? AND reset_expiry > ?");
        $stmt->execute([$token, $now]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $hashed = password_hash($new_pw, PASSWORD_DEFAULT);
            $stmt = $db->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expiry = NULL WHERE email = ?");
            $stmt->execute([$hashed, $user['email']]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Link ist ungültig oder abgelaufen.']);
        }
        exit;
    }

    // --- LEHRPERSONEN FUNKTIONEN --- //
    if ($action === 'admin_login') {
        if ($data['password'] === $admin_password) {
            $stmt = $db->query("
                SELECT s.*, u.email 
                FROM scores s 
                LEFT JOIN users u ON s.username = u.username 
                ORDER BY s.id DESC 
                LIMIT 500
            ");
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'scores' => $scores]);
        } else {
            sleep(4);
            echo json_encode(['success' => false, 'message' => 'Falsches Passwort']);
        }
        exit;
    }

    if ($action === 'admin_get_users') {
        if ($data['password'] === $admin_password) {
            $stmt = $db->query("SELECT email, username FROM users ORDER BY username ASC");
            echo json_encode(['success' => true, 'users' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } else {
            echo json_encode(['success' => false]);
        }
        exit;
    }

    if ($action === 'admin_generate_reset') {
        if ($data['password'] === $admin_password) {
            $email = $data['user_email'];
            $token = bin2hex(random_bytes(16));
            $expiry = date('Y-m-d H:i:s', time() + (24 * 60 * 60)); // 24 Stunden gültig

            $stmt = $db->prepare("UPDATE users SET reset_token = ?, reset_expiry = ? WHERE email = ?");
            $stmt->execute([$token, $expiry, $email]);

            // Link dynamisch generieren
            $base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']);
            $reset_url = rtrim($base_url, '/') . '/reset.html?token=' . $token;

            echo json_encode(['success' => true, 'link' => $reset_url]);
        } else {
            echo json_encode(['success' => false]);
        }
        exit;
    }

    if ($action === 'admin_delete_score') {
        if ($data['password'] === $admin_password) {
            $score_id = (int)($data['score_id'] ?? 0);
            if ($score_id > 0) {
                $stmt = $db->prepare("DELETE FROM scores WHERE id = ?");
                $stmt->execute([$score_id]);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Ungueltige ID']);
            }
        } else {
            sleep(2);
            echo json_encode(['success' => false, 'message' => 'Falsches Passwort']);
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

    if ($action === 'get_leaderboard') {
        $type = $_GET['type'] ?? 'specific';
        if ($type === 'overall') {
            $stmt = $db->query("
                SELECT s1.username, s1.lesson, s1.mode, s1.spm, s1.apm
                FROM scores s1
                INNER JOIN (
                    SELECT username, MAX(spm) as max_spm
                    FROM scores
                    GROUP BY username
                ) s2 ON s1.username = s2.username AND s1.spm = s2.max_spm
                GROUP BY s1.username
                ORDER BY s1.spm DESC, s1.apm DESC
                LIMIT 10
            ");
            $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
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
        }
        echo json_encode($leaderboard);
        exit;
    }
}
?>
