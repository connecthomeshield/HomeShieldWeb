<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method Not Allowed"]);
    exit;
}

// Retrieve and parse inputs (handle both JSON body and URL-encoded forms)
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
if (!$data) {
    $data = $_POST;
}

// Validate required fields
$name     = isset($data['name'])     ? trim($data['name'])     : '';
$phone    = isset($data['phone'])    ? trim($data['phone'])    : '';
$email    = isset($data['email'])    ? trim($data['email'])    : '';
$pincode  = isset($data['pincode'])  ? trim($data['pincode'])  : '';
$service  = isset($data['service'])  ? trim($data['service'])  : '';
$message  = isset($data['message'])  ? trim($data['message'])  : '';
$ticketId = isset($data['ticketId']) ? trim($data['ticketId']) : '';

if (empty($name) || empty($phone) || empty($pincode) || empty($ticketId)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required form fields."]);
    exit;
}

// Service display names mapping
$servicesMap = [
    "moisture"   => "Professional Damp & Moisture Scan",
    "waterproof" => "Full Waterproofing Work",
    "painting"   => "Home Painting Consultation",
    "all"        => "Complete Protection Bundle"
];
$serviceName = isset($servicesMap[$service]) ? $servicesMap[$service] : $service;

// =========================================================================
// BREVO SMTP RELAY CONFIGURATION
// Uses smtp-relay.brevo.com on Port 587 with STARTTLS (not blocked by Render)
// Credentials are loaded from Render environment variables for security.
// In your Render Dashboard -> Environment, set:
//   BREVO_SMTP_USER = acac05001@smtp-brevo.com
//   BREVO_SMTP_PASS = xsmtpsib-1a8703e...
// =========================================================================
$smtpHost = 'smtp-relay.brevo.com';
$smtpPort = 587;
$smtpUser = getenv('BREVO_SMTP_USER') ?: 'acac05001@smtp-brevo.com';
$smtpPass = getenv('BREVO_SMTP_PASS');
$fromEmail = 'acac05001@smtp-brevo.com';
$fromName  = 'HomeShield Paint Services';
$toEmail   = 'connect.homeshield@gmail.com';

// Fail gracefully if SMTP password is not configured
if (empty($smtpPass)) {
    http_response_code(200);
    echo json_encode([
        "success"   => true,
        "message"   => "Lead registered successfully. Email delivery is pending — please set BREVO_SMTP_PASS environment variable on Render.",
        "ticketId"  => $ticketId,
        "emailSent" => false
    ]);
    exit;
}

// =========================================================================
// SMTP HELPERS
// =========================================================================
function smtpRead($socket) {
    $response = '';
    while ($line = fgets($socket, 515)) {
        $response .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') break;
    }
    return $response;
}

function smtpCmd($socket, $cmd, $expectedCode) {
    fwrite($socket, $cmd . "\r\n");
    $resp = smtpRead($socket);
    if (substr($resp, 0, 3) !== (string)$expectedCode) {
        throw new Exception("SMTP Error on '$cmd': expected $expectedCode, got: $resp");
    }
    return $resp;
}

// =========================================================================
// EMAIL BODY
// =========================================================================
$subject = "New HomeShield Lead Registered [{$ticketId}]";

$emailHtml = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Inspection Request</title>
    <style>
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .header { background-color: #050e1e; padding: 40px 30px; text-align: center; border-bottom: 4px solid #e2a83a; }
        .logo { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
        .logo span { color: #e2a83a; }
        .badge { display: inline-block; background-color: rgba(226,168,58,0.15); border: 1px solid rgba(226,168,58,0.3); color: #e2a83a; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 12px; border-radius: 9999px; margin-top: 10px; }
        .content { padding: 40px 30px; }
        .title { font-size: 20px; font-weight: 700; color: #050e1e; margin-top: 0; margin-bottom: 20px; }
        .grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .grid th { text-align: left; padding: 12px 16px; background-color: #f9fafb; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; width: 35%; border-bottom: 1px solid #f3f4f6; }
        .grid td { padding: 12px 16px; font-size: 14px; font-weight: 600; color: #111827; border-bottom: 1px solid #f3f4f6; }
        .message-box { background-color: #f9fafb; border-left: 4px solid #e2a83a; padding: 16px; font-size: 14px; font-style: italic; color: #374151; border-radius: 0 12px 12px 0; margin-top: 10px; }
        .footer { background-color: #f9fafb; padding: 24px 30px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        .footer a { color: #e2a83a; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">HOME<span>SHIELD</span></h1>
            <span class="badge">Inspection Registry Lead</span>
        </div>
        <div class="content">
            <h2 class="title">New Service Lead Registered</h2>
            <p style="font-size:14px;color:#4b5563;margin-bottom:25px;line-height:1.5;">A new home diagnostic or service booking enquiry has been received from the website. Below are the registered lead details:</p>
            <table class="grid">
                <tr>
                    <th>Appointment Code</th>
                    <td style="color:#e2a83a;font-family:monospace;font-size:16px;font-weight:900;">' . htmlspecialchars($ticketId) . '</td>
                </tr>
                <tr>
                    <th>Client Name</th>
                    <td>' . htmlspecialchars($name) . '</td>
                </tr>
                <tr>
                    <th>Phone Number</th>
                    <td>' . htmlspecialchars($phone) . '</td>
                </tr>
                <tr>
                    <th>Email Address</th>
                    <td>' . (empty($email) ? '<span style="color:#9ca3af;font-weight:normal;font-style:italic;">Not Provided</span>' : htmlspecialchars($email)) . '</td>
                </tr>
                <tr>
                    <th>Postal Pin Code</th>
                    <td>' . htmlspecialchars($pincode) . '</td>
                </tr>
                <tr>
                    <th>Requested Service</th>
                    <td>' . htmlspecialchars($serviceName) . '</td>
                </tr>
            </table>
            ' . (!empty($message) ? '
            <h3 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:5px;">Client Message</h3>
            <div class="message-box">"' . nl2br(htmlspecialchars($message)) . '"</div>
            ' : '') . '
        </div>
        <div class="footer">
            <p>This is an automated operational email sent from your website backend server.</p>
            <p>&copy; 2026 <a href="#">HomeShield Paint Services</a>. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
';

// =========================================================================
// SEND VIA BREVO SMTP RELAY (Port 587 STARTTLS)
// =========================================================================
try {
    // 1. Open plain TCP connection to Brevo SMTP relay on port 587
    $socket = @stream_socket_client(
        "tcp://{$smtpHost}:{$smtpPort}",
        $errno, $errstr, 15,
        STREAM_CLIENT_CONNECT
    );

    if (!$socket) {
        throw new Exception("Could not connect to Brevo SMTP relay: {$errstr} ({$errno})");
    }

    stream_set_timeout($socket, 15);

    // 2. Read server greeting (220)
    $greeting = smtpRead($socket);
    if (substr($greeting, 0, 3) !== '220') {
        throw new Exception("Unexpected SMTP greeting: {$greeting}");
    }

    // 3. EHLO handshake
    smtpCmd($socket, "EHLO localhost", 250);

    // 4. Upgrade the plain connection to TLS using STARTTLS
    smtpCmd($socket, "STARTTLS", 220);

    // Wrap the raw socket in a TLS stream
    $crypto = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
    if (!$crypto) {
        throw new Exception("Failed to enable TLS on Brevo SMTP connection.");
    }

    // 5. Re-EHLO over the encrypted connection
    smtpCmd($socket, "EHLO localhost", 250);

    // 6. AUTH LOGIN
    smtpCmd($socket, "AUTH LOGIN", 334);
    smtpCmd($socket, base64_encode($smtpUser), 334);
    smtpCmd($socket, base64_encode($smtpPass), 235);

    // 7. Set envelope sender & recipient
    smtpCmd($socket, "MAIL FROM:<{$fromEmail}>", 250);
    smtpCmd($socket, "RCPT TO:<{$toEmail}>", 250);

    // 8. Send DATA
    smtpCmd($socket, "DATA", 354);

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$fromName} <{$fromEmail}>\r\n";
    $headers .= "To: <{$toEmail}>\r\n";
    $headers .= "Subject: {$subject}\r\n";
    $headers .= "Date: " . date("r") . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    fwrite($socket, $headers . "\r\n" . $emailHtml . "\r\n.\r\n");
    $dataResp = smtpRead($socket);
    if (substr($dataResp, 0, 3) !== '250') {
        throw new Exception("SMTP DATA failed: {$dataResp}");
    }

    // 9. QUIT
    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    echo json_encode([
        "success"   => true,
        "message"   => "Lead registered & email dispatched via Brevo SMTP relay.",
        "ticketId"  => $ticketId,
        "emailSent" => true
    ]);

} catch (Exception $e) {
    if (isset($socket) && is_resource($socket)) {
        fclose($socket);
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => "Email dispatch failed: " . $e->getMessage()
    ]);
}
