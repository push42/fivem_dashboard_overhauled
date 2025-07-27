<?php
// Modern API router for the FiveM Dashboard
require_once 'cors_helper.php';

// Clean any output buffering and start fresh
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

// Initialize CORS
initCors();

// Database configuration
class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        $config = [
            'host' => 'localhost',
            'dbname' => 'webdev',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8mb4'
        ];

        try {
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
            $this->connection = new PDO($dsn, $config['username'], $config['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit();
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }
}

// Response helper
class ApiResponse {
    public static function success($data = null, $message = null) {
        $response = ['success' => true];
        if ($data !== null) $response['data'] = $data;
        if ($message !== null) $response['message'] = $message;
        echo json_encode($response);
        exit();
    }

    public static function error($message, $code = 400, $data = null) {
        http_response_code($code);
        $response = ['success' => false, 'error' => $message];
        if ($data !== null) $response['data'] = $data;
        echo json_encode($response);
        exit();
    }
}

// Request helper
class Request {
    public static function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function getPath() {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return str_replace('/api', '', $path);
    }

    public static function getBody() {
        return json_decode(file_get_contents('php://input'), true) ?? [];
    }

    public static function getParam($key, $default = null) {
        return $_REQUEST[$key] ?? $default;
    }
}

// Session helper
class Session {
    public static function start() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function get($key, $default = null) {
        self::start();
        return $_SESSION[$key] ?? $default;
    }

    public static function set($key, $value) {
        self::start();
        $_SESSION[$key] = $value;
    }

    public static function destroy() {
        self::start();
        session_destroy();
    }

    public static function isLoggedIn() {
        return self::get('loggedin') === true;
    }

    public static function requireAuth() {
        if (!self::isLoggedIn()) {
            ApiResponse::error('Authentication required', 401);
        }
    }
}

// Basic routing
$method = Request::getMethod();
$path = Request::getPath();

// Public routes (no authentication required)
switch ($path) {
    case '/login':
        if ($method === 'POST') {
            require_once 'api/auth/login.php';
        }
        break;

    case '/register':
        if ($method === 'POST') {
            require_once 'api/auth/register.php';
        }
        break;

    case '/check-auth':
        if ($method === 'GET') {
            require_once 'api/auth/check.php';
        }
        break;

    case '/logout':
        if ($method === 'POST') {
            require_once 'api/auth/logout.php';
        }
        break;
}

// Protected routes (authentication required)
Session::requireAuth();

switch ($path) {
    // Chat endpoints
    case '/chat/messages':
        if ($method === 'GET') {
            require_once 'api/chat/get_messages.php';
        } elseif ($method === 'POST') {
            require_once 'api/chat/send_message.php';
        }
        break;

    case '/chat/stats':
        if ($method === 'GET') {
            require_once 'api/chat/get_stats.php';
        }
        break;

    case '/chat/online-users':
        if ($method === 'GET') {
            require_once 'api/chat/get_online_users.php';
        }
        break;

    // Todo endpoints
    case '/todo/tasks':
        if ($method === 'GET') {
            require_once 'api/todo/get_tasks.php';
        } elseif ($method === 'POST') {
            require_once 'api/todo/create_task.php';
        }
        break;

    case '/todo/toggle':
        if ($method === 'POST') {
            require_once 'api/todo/toggle_task.php';
        }
        break;

    case '/todo/delete':
        if ($method === 'DELETE') {
            require_once 'api/todo/delete_task.php';
        }
        break;

    // Server endpoints
    case '/server/status':
        if ($method === 'GET') {
            require_once 'api/server/get_status.php';
        }
        break;

    // User endpoints
    case '/user/heartbeat':
        if ($method === 'POST') {
            require_once 'api/user/heartbeat.php';
        }
        break;

    case '/user/profile':
        if ($method === 'PUT') {
            require_once 'api/user/update_profile.php';
        }
        break;

    // FiveM endpoints
    case '/fivem/players':
        if ($method === 'GET') {
            require_once 'api/fivem/get_players.php';
        }
        break;

    case '/fivem/vehicles':
        if ($method === 'GET') {
            require_once 'api/fivem/get_vehicles.php';
        }
        break;

    case '/fivem/hall-of-fame':
        if ($method === 'GET') {
            require_once 'api/fivem/get_hall_of_fame.php';
        }
        break;

    case '/fivem/server-status':
        if ($method === 'GET') {
            require_once 'api/fivem/get_server_status.php';
        }
        break;

    default:
        ApiResponse::error('Endpoint not found', 404);
}
?>
