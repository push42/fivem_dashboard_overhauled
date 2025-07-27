<?php
// Check authentication status
Session::start();

if (Session::isLoggedIn()) {
    $userData = [
        'id' => Session::get('id'),
        'username' => Session::get('username'),
        'avatar_url' => Session::get('avatar_url'),
        'rank' => Session::get('rank')
    ];

    ApiResponse::success([
        'authenticated' => true,
        'user' => $userData
    ]);
} else {
    ApiResponse::success([
        'authenticated' => false
    ]);
}
?>
