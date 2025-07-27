<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'webdev');
define('DB_USER', 'root');
define('DB_PASS', '');

// FiveM Database configuration
define('FIVEM_DB_HOST', 'localhost');
define('FIVEM_DB_NAME', 'db_fivemtest');
define('FIVEM_DB_USER', 'root');
define('FIVEM_DB_PASS', '');

// TrackyServer API
define('TRACKY_SERVER_KEY', 'your_tracky_server_key_here');
define('TRACKY_SERVER_ID', 'your_server_id_here');

class Database {
    private static $instance = null;
    private $connection;
    private $fivemConnection;

    private function __construct() {
        try {
            // Main database connection
            $this->connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );

            // FiveM database connection
            $this->fivemConnection = new PDO(
                "mysql:host=" . FIVEM_DB_HOST . ";dbname=" . FIVEM_DB_NAME,
                FIVEM_DB_USER,
                FIVEM_DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die("Connection failed: " . $e->getMessage());
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

    public function getFivemConnection() {
        return $this->fivemConnection;
    }
}
?>
