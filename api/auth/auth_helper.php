<?php
/**
 * Authentication Helper Functions
 * Utility functions for user authentication and activity logging
 */

/**
 * Log user activity to the database
 *
 * @param PDO $db Database connection
 * @param string $userId User ID
 * @param string $username Username
 * @param string $action Action performed
 * @param array $details Additional details (optional)
 * @return bool Success status
 */
function logUserActivity($db, $userId, $username, $action, $details = []) {
    try {
        // Parse user agent for browser/OS info
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        $browser = getBrowserFromUserAgent($userAgent);
        $os = getOSFromUserAgent($userAgent);
        $deviceType = getDeviceTypeFromUserAgent($userAgent);

        // Prepare details as JSON
        $detailsJson = json_encode(array_merge($details, [
            'timestamp' => date('c'),
            'endpoint' => $_SERVER['REQUEST_URI'] ?? 'unknown'
        ]));

        $query = "INSERT INTO user_logs
                 (user_id, username, action, details, ip_address, user_agent, browser, os, device_type, session_id, success)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $db->prepare($query);
        $result = $stmt->execute([
            $userId,
            $username,
            $action,
            $detailsJson,
            $_SERVER['REMOTE_ADDR'] ?? null,
            $userAgent,
            $browser,
            $os,
            $deviceType,
            session_id() ?? null,
            true
        ]);

        return $result;
    } catch (Exception $e) {
        error_log("Failed to log user activity: " . $e->getMessage());
        return false;
    }
}

/**
 * Extract browser name from user agent string
 *
 * @param string $userAgent User agent string
 * @return string Browser name
 */
function getBrowserFromUserAgent($userAgent) {
    if (strpos($userAgent, 'Chrome') !== false) {
        return 'Chrome';
    } elseif (strpos($userAgent, 'Firefox') !== false) {
        return 'Firefox';
    } elseif (strpos($userAgent, 'Safari') !== false && strpos($userAgent, 'Chrome') === false) {
        return 'Safari';
    } elseif (strpos($userAgent, 'Edge') !== false) {
        return 'Edge';
    } elseif (strpos($userAgent, 'Opera') !== false || strpos($userAgent, 'OPR') !== false) {
        return 'Opera';
    } else {
        return 'Unknown';
    }
}

/**
 * Extract OS name from user agent string
 *
 * @param string $userAgent User agent string
 * @return string OS name
 */
function getOSFromUserAgent($userAgent) {
    if (strpos($userAgent, 'Windows NT 10') !== false) {
        return 'Windows 10/11';
    } elseif (strpos($userAgent, 'Windows NT') !== false) {
        return 'Windows';
    } elseif (strpos($userAgent, 'Mac OS X') !== false || strpos($userAgent, 'macOS') !== false) {
        return 'macOS';
    } elseif (strpos($userAgent, 'Linux') !== false) {
        return 'Linux';
    } elseif (strpos($userAgent, 'Android') !== false) {
        return 'Android';
    } elseif (strpos($userAgent, 'iOS') !== false || strpos($userAgent, 'iPhone') !== false || strpos($userAgent, 'iPad') !== false) {
        return 'iOS';
    } else {
        return 'Unknown';
    }
}

/**
 * Determine device type from user agent string
 *
 * @param string $userAgent User agent string
 * @return string Device type
 */
function getDeviceTypeFromUserAgent($userAgent) {
    if (strpos($userAgent, 'Mobile') !== false || strpos($userAgent, 'Android') !== false || strpos($userAgent, 'iPhone') !== false) {
        return 'Mobile';
    } elseif (strpos($userAgent, 'Tablet') !== false || strpos($userAgent, 'iPad') !== false) {
        return 'Tablet';
    } else {
        return 'Desktop';
    }
}

/**
 * Check if user has required rank
 *
 * @param string $userRank Current user rank
 * @param string $requiredRank Required rank
 * @return bool Has required rank
 */
function hasRequiredRank($userRank, $requiredRank) {
    $ranks = [
        'User' => 1,
        'Supporter' => 2,
        'Moderator' => 3,
        'Admin' => 4,
        'Owner' => 5
    ];

    $userLevel = $ranks[$userRank] ?? 0;
    $requiredLevel = $ranks[$requiredRank] ?? 0;

    return $userLevel >= $requiredLevel;
}

/**
 * Validate session and return user data
 *
 * @param PDO $db Database connection
 * @return array|false User data or false if invalid
 */
function validateSession($db) {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['username'])) {
        return false;
    }

    try {
        $query = "SELECT id, username, name, email, rank, avatar_url, is_active
                  FROM staff_accounts
                  WHERE id = ? AND is_active = ?";

        $stmt = $db->prepare($query);
        $stmt->execute([$_SESSION['user_id'], true]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            session_destroy();
            return false;
        }

        return $user;
    } catch (Exception $e) {
        error_log("Session validation error: " . $e->getMessage());
        return false;
    }
}

/**
 * Generate secure random token
 *
 * @param int $length Token length
 * @return string Random token
 */
function generateSecureToken($length = 32) {
    return bin2hex(random_bytes($length));
}

/**
 * Sanitize and validate username
 *
 * @param string $username Username to validate
 * @return string|false Sanitized username or false if invalid
 */
function validateUsername($username) {
    $username = trim($username);

    // Check length
    if (strlen($username) < 3 || strlen($username) > 255) {
        return false;
    }

    // Check for valid characters (alphanumeric, underscore, hyphen)
    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
        return false;
    }

    return $username;
}

/**
 * Rate limit check for authentication attempts
 *
 * @param string $identifier IP address or username
 * @param int $maxAttempts Maximum attempts allowed
 * @param int $timeWindow Time window in seconds
 * @return bool True if under rate limit
 */
function checkRateLimit($identifier, $maxAttempts = 5, $timeWindow = 300) {
    $cacheFile = sys_get_temp_dir() . '/auth_rate_limit_' . md5($identifier);

    if (!file_exists($cacheFile)) {
        file_put_contents($cacheFile, json_encode(['attempts' => 1, 'first_attempt' => time()]));
        return true;
    }

    $data = json_decode(file_get_contents($cacheFile), true);

    // Reset if time window has passed
    if (time() - $data['first_attempt'] > $timeWindow) {
        file_put_contents($cacheFile, json_encode(['attempts' => 1, 'first_attempt' => time()]));
        return true;
    }

    // Check if under limit
    if ($data['attempts'] < $maxAttempts) {
        $data['attempts']++;
        file_put_contents($cacheFile, json_encode($data));
        return true;
    }

    return false;
}
?>
