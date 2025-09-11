<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
// backend/contact/send_contact_email.php
require '../vendor/autoload.php'; // Path to PHPMailer autoload if installed via Composer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$message = $data['message'] ?? '';

$mail = new PHPMailer(true);
try {
    //Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'agrilinks35@gmail.com';
    $mail->Password   = 'qmkp pjyy sxzv dnng '; 
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    //Recipients
    $mail->setFrom($email ?: 'agrilinks35@gmail.com', $name ?: 'Contact User');
    $mail->addAddress('agrilinks35@gmail.com', 'Agrilink Contact');

    //Content
    $mail->isHTML(false);
    $mail->Subject = 'Contact Form Submission';
    $mail->Body    = "Name: $name\nEmail: $email\nMessage: $message";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Email sent!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
}
?>
