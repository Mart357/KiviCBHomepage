<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// PHPMailer autoloadimine
require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $message = htmlspecialchars($_POST['message']);

    if ($email === false) {
        echo "Vigane e-posti aadress.";
        exit;
    }

    $mail = new PHPMailer(true); // PHPMailer objekti loomine

    try {
        // SMTP serveri seadistamine
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Gmail SMTP-server (muuda vastavalt vajadusele)
        $mail->SMTPAuth = true;
        $mail->Username = 'info.kivicb@gmail.com'; // Sinu e-posti aadress
        $mail->Password = 'kivitalusaia123'; // Sinu e-posti parool või rakenduse salasõna
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Krüptimine (STARTTLS)
        $mail->Port = 587; // SMTP-port

        // Saatja ja saaja info
        $mail->setFrom($email, $name); // Kasutaja poolt sisestatud e-post ja nimi
        $mail->addAddress('info.kivicb@gmail.com', 'Kivi CB Trading'); // Vastuvõtja e-post

        // Kirja sisu
        $mail->isHTML(true);
        $mail->Subject = 'Kontaktivormi uus teade';
        $mail->Body = "
            <h2>Uus kontaktivormi sõnum</h2>
            <p><strong>Nimi:</strong> $name</p>
            <p><strong>E-post:</strong> $email</p>
            <p><strong>Sõnum:</strong></p>
            <p>$message</p>
        ";
        $mail->AltBody = "Nimi: $name\nE-post: $email\nSõnum:\n$message";

        // Kirja saatmine
        $mail->send();
        echo "Kiri saadeti edukalt! Täname, et võtsite meiega ühendust.";
    } catch (Exception $e) {
        echo "Kirja saatmine ebaõnnestus. Viga: {$mail->ErrorInfo}";
    }
}
