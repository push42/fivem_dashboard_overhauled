<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the user is already logged in, then redirect to the dashboard page
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header("Location: index.php");
    exit;
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=webdev", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $username = $_POST['username'];
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
        $provided_code = $_POST['security_code'];

        // Validate input and check if passwords match
        if ($password !== $confirm_password) {
            $register_error = "Die Passwörter stimmen nicht überein.";
        } else {
            // Check if the username is already taken
            $stmt = $pdo->prepare("SELECT id FROM staff_accounts WHERE username = ?");
            $stmt->execute([$username]);

            if ($stmt->rowCount() > 0) {
                $register_error = "Der Benutzername ist bereits vergeben.";
            } else {
                // Check if the provided code is valid
                $stmt = $pdo->prepare("SELECT code FROM security_codes WHERE code = ?");
                $stmt->execute([$provided_code]);

                if ($stmt->rowCount() > 0) {
                    // Code is valid, proceed with registration

                    // Save the avatar URL from the form in a variable
                    $avatar_url = $_POST['avatar_url'];

                    // Prepare and execute the INSERT statement
                    $stmt = $pdo->prepare("INSERT INTO staff_accounts (username, password, avatar_url) VALUES (?, ?, ?)");
                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

                    if ($stmt->execute([$username, $hashed_password, $avatar_url])) {
                        // Registration successful, display success message
                        $register_success = "Registrierung erfolgreich! Sie können sich jetzt einloggen.";
                    } else {
                        // Registration failed
                        $register_error = "Fehler bei der Registrierung. Bitte versuchen Sie es erneut.";
                    }
                } else {
                    // Invalid code
                    $register_error = "Ungültiger Sicherheitscode.";
                }
            }
        }
    } catch (PDOException $e) {
        die("Verbindung Fehlgeschlagen: " . $e->getMessage());
    }
}
    ?>
<!DOCTYPE html>
<html>

<head>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="css/style_register.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMt23cez/3pa5F3MR0sA0FfDOMt23cez/3pa5F3" crossorigin="anonymous">
    <title>Registrierung</title>
</head>

<body>
    <div id="particles-js"></div>
    <div class="register-container">
    <img src="https://i.ibb.co/smLg902/Untitled-1.gif" alt="Logo" class="register-logo"></img>
        <div class="header-text">
            <h2>Dashboard - Registrierung</h2>
        </div>
        <form method="post" action="">
            <div class="form-field">
                <label class="register-username">
                    <span class="form-icons">&#128100;</span> Benutzername:
                </label>
                <input type="text" name="username" required>
            </div>
            <div class="form-field">
                <label class="register-password">
                    <span class="form-icons2">&#128273;</span> Passwort:
                </label>
                <input type="password" name="password" required>
            </div>
            <div class="form-field">
                <label class="register-password">
                    <span class="form-icons2">&#128273;</span> Passwort bestätigen:
                </label>
                <input type="password" name="confirm_password" required>
            </div>
            <div class="form-field">
                <label class="register-password">
                    <span class="form-icons2">&#128248;</span> Avatar-URL:
                </label>
                <input type="text" name="avatar_url">
            </div>
            <div class="form-field">
                <label class="register-security-code">
                    <span class="form-icons4">&#128274;</span> Sicherheitscode:
                </label>
                <input type="text" name="security_code" required>
            </div>

            <div class="info-icon" onclick="toggleInfoBox()">
                
            </div>
            <div class="info-box" id="infoBox">
            <span class="form-icons3">&#8505;</span>
                Den Sicherheitscode erhälst du im Discord.
            </div>

            <input type="submit" value="Registrieren">
        </form>
    </div>
    <script src="js/script_register.js"></script>
</body>

</html>
