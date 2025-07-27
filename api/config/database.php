<?php
// Database configuration - Supports both MySQL and PostgreSQL
define('DB_TYPE', 'postgresql'); // 'mysql' or 'postgresql'
define('DB_HOST', 'localhost'); // Database host
define('DB_NAME', 'fivem_dashboard'); // Use the name you want the dashboard database table to be named
define('DB_USER', 'postgres'); // PostgreSQL default user
define('DB_PASS', ''); // Empty password for default Laragon setup
define('DB_PORT', DB_TYPE === 'postgresql' ? 5432 : 3306);
define('DB_CHARSET', 'utf8mb4');

// FiveM Database configuration - Using same database for development
define('FIVEM_DB_TYPE', 'postgresql'); // 'mysql' or 'postgresql'
define('FIVEM_DB_HOST', 'localhost');
define('FIVEM_DB_NAME', 'fivem_dashboard'); // Using same database with mock FiveM tables
define('FIVEM_DB_USER', 'postgres');
define('FIVEM_DB_PASS', '');
define('FIVEM_DB_PORT', FIVEM_DB_TYPE === 'postgresql' ? 5432 : 3306);

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
            $this->connection = $this->createConnection(
                DB_TYPE, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
            );

            // FiveM database connection
            $this->fivemConnection = $this->createConnection(
                FIVEM_DB_TYPE, FIVEM_DB_HOST, FIVEM_DB_PORT, FIVEM_DB_NAME, FIVEM_DB_USER, FIVEM_DB_PASS
            );
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die("Connection failed: " . $e->getMessage());
        }
    }

    private function createConnection($type, $host, $port, $dbname, $user, $pass) {
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        if ($type === 'postgresql') {
            $dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";
        } else {
            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=" . DB_CHARSET;
            $options[PDO::MYSQL_ATTR_INIT_COMMAND] = "SET NAMES " . DB_CHARSET;
        }

        return new PDO($dsn, $user, $pass, $options);
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

    public function getDbType() {
        return DB_TYPE;
    }

    public function getFivemDbType() {
        return FIVEM_DB_TYPE;
    }

    // Helper method to get database-specific syntax
    public function getRandomFunction() {
        return DB_TYPE === 'postgresql' ? 'RANDOM()' : 'RAND()';
    }

    public function getCurrentTimestamp() {
        return DB_TYPE === 'postgresql' ? 'CURRENT_TIMESTAMP' : 'NOW()';
    }

    public function getLimit($offset, $limit) {
        if (DB_TYPE === 'postgresql') {
            return "LIMIT {$limit} OFFSET {$offset}";
        } else {
            return "LIMIT {$offset}, {$limit}";
        }
    }

    // UUID generation for both databases
    public function generateUuid() {
        if (DB_TYPE === 'postgresql') {
            $stmt = $this->connection->query('SELECT uuid_generate_v4() as uuid');
            return $stmt->fetch()['uuid'];
        } else {
            return bin2hex(random_bytes(16));
        }
    }

    // JSON field handling
    public function jsonExtract($field, $path) {
        if (DB_TYPE === 'postgresql') {
            return "{$field}->'{$path}'";
        } else {
            return "JSON_EXTRACT({$field}, '$.{$path}')";
        }
    }
}

// Database Query Builder for cross-database compatibility
class QueryBuilder {
    private $db;
    private $dbType;

    public function __construct($connection, $dbType) {
        $this->db = $connection;
        $this->dbType = $dbType;
    }

    public function insertIgnore($table, $data) {
        $columns = implode(',', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));

        if ($this->dbType === 'postgresql') {
            $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders}) ON CONFLICT DO NOTHING";
        } else {
            $sql = "INSERT IGNORE INTO {$table} ({$columns}) VALUES ({$placeholders})";
        }

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($data);
    }

    public function upsert($table, $data, $conflictColumns) {
        $columns = implode(',', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));

        if ($this->dbType === 'postgresql') {
            $conflict = implode(',', $conflictColumns);
            $updates = [];
            foreach ($data as $key => $value) {
                if (!in_array($key, $conflictColumns)) {
                    $updates[] = "{$key} = EXCLUDED.{$key}";
                }
            }
            $updateClause = implode(', ', $updates);
            $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders}) ON CONFLICT ({$conflict}) DO UPDATE SET {$updateClause}";
        } else {
            $updates = [];
            foreach ($data as $key => $value) {
                $updates[] = "{$key} = VALUES({$key})";
            }
            $updateClause = implode(', ', $updates);
            $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders}) ON DUPLICATE KEY UPDATE {$updateClause}";
        }

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($data);
    }

    public function paginate($baseQuery, $params, $page, $perPage) {
        $offset = ($page - 1) * $perPage;

        if ($this->dbType === 'postgresql') {
            $sql = $baseQuery . " LIMIT {$perPage} OFFSET {$offset}";
        } else {
            $sql = $baseQuery . " LIMIT {$offset}, {$perPage}";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
?>
?>
