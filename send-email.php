<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    $phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : ''; // Kontrollige telefoninumbri olemasolu

    $to = "info.kivicb@gmail.com"; // Asenda oma e-posti aadressiga
    $subject = "Küsimus/Hinnapäring/Mure - $name";
    $headers = "From: $email" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "Content-Type: text/html; charset=UTF-8";

    // Meilisõnumi keha, kus lisame telefoniinfo, kui see on olemas
    $body = "
    <html>
    <head>
        <title>$subject</title>
    </head>
    <body>
        <h2>Uus sõnum kontaktivormist</h2>
        <p><strong>Nimi:</strong> $name</p>
        <p><strong>E-post:</strong> $email</p>";

    // Kui telefoninumber on täidetud, lisame selle meilisõnumisse
    if (!empty($phone)) {
        $body .= "<p><strong>Telefoninumber:</strong> $phone</p>";
    }

    $body .= "<p><strong>Sõnum:</strong><br>$message</p>";

    // Meilisõnumi lõpp
    
    

    $body .= "</body>
    </html>";

    // Saatmine
    if (mail($to, $subject, $body, $headers)) {
        echo "<script>alert('Sõnum saadetud edukalt!'); window.location.href = 'thank-you.html';</script>";
    } else {
        echo "<script>alert('Kahjuks tekkis viga sõnumi saatmisel. Palun proovige hiljem uuesti.'); window.location.href = 'contact.html';</script>";
    }
}
?>
