<?php
// Production Database configuration for 5md.p42.studio
// You'll need to update these values with your actual Hetzner database credentials

// ===========================================
// CHOOSE YOUR DATABASE TYPE (MySQL or PostgreSQL)
// ===========================================

// OPTION A: MySQL (Most Common for Shared Hosting)
define('DB_TYPE', 'mysql');
define('DB_HOST', 'localhost'); // Or your database host
define('DB_NAME', 'your_database_name'); // Your actual database name
define('DB_USER', 'your_db_user'); // Your database username
define('DB_PASS', 'your_db_password'); // Your database password
define('DB_PORT', 3306);
define('DB_CHARSET', 'utf8mb4');

// OPTION B: PostgreSQL (Advanced/VPS Hosting)
// Uncomment these and comment out MySQL settings above if using PostgreSQL:
// define('DB_TYPE', 'postgresql');
// define('DB_HOST', 'localhost');
// define('DB_NAME', 'your_database_name');
// define('DB_USER', 'your_db_user');
// define('DB_PASS', 'your_db_password');
// define('DB_PORT', 5432);
// define('DB_CHARSET', 'utf8');

// FiveM Database configuration (can be same as main DB for mockup data)
define('FIVEM_DB_TYPE', 'mysql'); // Change to 'postgresql' if using PostgreSQL above
define('FIVEM_DB_HOST', 'localhost');
define('FIVEM_DB_NAME', 'your_database_name'); // Same DB with mock FiveM tables
define('FIVEM_DB_USER', 'your_db_user');
define('FIVEM_DB_PASS', 'your_db_password');
define('FIVEM_DB_PORT', 3306); // Change to 5432 for PostgreSQL

// TrackyServer API (optional - for real FiveM integration)
define('TRACKY_SERVER_KEY', 'your_tracky_server_key_here');
define('TRACKY_SERVER_ID', 'your_server_id_here');

// Production optimizations
ini_set('display_errors', 0);
error_reporting(0);

// Include the main database class (rest of the file remains the same)
include_once 'database.php';
?>
