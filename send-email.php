<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method Not Allowed"]);
    exit;
}

// Retrieve and parse inputs (handle both JSON and URL-encoded forms)
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

// Validate required fields
$name = isset($data['name']) ? trim($data['name']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$pincode = isset($data['pincode']) ? trim($data['pincode']) : '';
$service = isset($data['service']) ? trim($data['service']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';
$ticketId = isset($data['ticketId']) ? trim($data['ticketId']) : '';

if (empty($name) || empty($phone) || empty($pincode) || empty($ticketId)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required form fields."]);
    exit;
}

// Service display names mapping
$servicesMap = [
    "moisture" => "Professional Damp & Moisture Scan",
    "waterproof" => "Full Waterproofing Work",
    "painting" => "Home Painting Consultation",
    "all" => "Complete Protection Bundle"
];
$serviceName = isset($servicesMap[$service]) ? $servicesMap[$service] : $service;

// SMTP Server Configuration
$smtpHost = "ssl://smtp.gmail.com";
$smtpPort = 465;
$smtpUser = "Lakshayb057@gmail.com";
$smtpPass = "bpwj hdxa ihcf eysh"; // Gmail App Password
$toEmail = "connect.homeshield@gmail.com";

// 1. Helper to read complete SMTP server response (handles multi-line responses)
function readSmtpResponse($socket) {
    $response = "";
    while ($line = fgets($socket, 512)) {
        $response .= $line;
        // SMTP response finishes when the 4th character is a space, not a hyphen
        if (strlen($line) >= 4 && substr($line, 3, 1) === ' ') {
            break;
        }
    }
    return $response;
}

// 2. Helper to send SMTP command and verify response prefix code
function executeSmtpCmd($socket, $cmd, $expectedCode) {
    fwrite($socket, $cmd . "\r\n");
    $response = readSmtpResponse($socket);
    $responseCode = substr($response, 0, 3);
    if ($responseCode !== (string)$expectedCode) {
        throw new Exception("SMTP Error: Command '$cmd' failed. Expected $expectedCode, got response: $response");
    }
    return $response;
}

try {
    // 3. Connect to the secure SSL socket
    $socket = @stream_socket_client("$smtpHost:$smtpPort", $errno, $errstr, 15, STREAM_CLIENT_CONNECT);
    if (!$socket) {
        throw new Exception("Could not connect to SMTP server: $errstr ($errno)");
    }

    // Set read timeout
    stream_set_timeout($socket, 10);

    // Read connection greeting (expecting 220)
    $greeting = readSmtpResponse($socket);
    if (substr($greeting, 0, 3) !== '220') {
        throw new Exception("SMTP Error: Invalid server greeting: $greeting");
    }

    // 4. SMTP Handshake & Login
    executeSmtpCmd($socket, "EHLO localhost", 250);
    executeSmtpCmd($socket, "AUTH LOGIN", 334);
    executeSmtpCmd($socket, base64_encode($smtpUser), 334);
    executeSmtpCmd($socket, base64_encode($smtpPass), 235);

    // 5. Set Sender and Recipient
    executeSmtpCmd($socket, "MAIL FROM:<$smtpUser>", 250);
    executeSmtpCmd($socket, "RCPT TO:<$toEmail>", 250);

    // 6. Start Email Data payload
    executeSmtpCmd($socket, "DATA", 354);

    // 7. Prepare beautifully designed HTML Email template
    $subject = "New HomeShield Lead Registered [{$ticketId}]";
    
    // Email Headers
    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "From: HomeShield Paint Services <{$smtpUser}>",
        "To: <{$toEmail}>",
        "Subject: {$subject}",
        "Date: " . date("r"),
        "X-Mailer: PHP/" . phpversion()
    ];

    // HTML Email Body with Premium Dark Navy & Gold Aesthetics
    $emailHtml = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Inspection Request</title>
        <style>
            body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
            .header { background-color: #050e1e; padding: 40px 30px; text-align: center; border-bottom: 4px solid #e2a83a; }
            .logo { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
            .logo span { color: #e2a83a; }
            .badge { display: inline-block; background-color: rgba(226, 168, 58, 0.15); border: 1px solid rgba(226, 168, 58, 0.3); color: #e2a83a; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 12px; border-radius: 9999px; margin-top: 10px; }
            .content { padding: 40px 30px; }
            .title { font-size: 20px; font-weight: 700; color: #050e1e; margin-top: 0; margin-bottom: 20px; }
            .grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .grid th { text-align: left; padding: 12px 16px; background-color: #f9fafb; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; width: 35%; border-bottom: 1px solid #f3f4f6; }
            .grid td { padding: 12px 16px; font-size: 14px; font-weight: 600; color: #111827; border-bottom: 1px solid #f3f4f6; }
            .message-box { background-color: #f9fafb; border-left: 4px solid #e2a83a; padding: 16px; font-size: 14px; font-style: italic; color: #374151; border-radius: 0 12px 12px 0; margin-top: 10px; }
            .footer { background-color: #f9fafb; padding: 24px 30px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
            .footer p { margin: 4px 0; }
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
                <p style="font-size: 14px; color: #4b5563; margin-bottom: 25px; line-height: 1.5;">A new home diagnostic or service booking enquiry has been received from the website. Below are the registered lead details:</p>
                
                <table class="grid">
                    <tr>
                        <th>Appointment Code</th>
                        <td style="color: #e2a83a; font-family: monospace; font-size: 16px; font-weight: 900;">' . htmlspecialchars($ticketId) . '</td>
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
                        <td>' . (empty($email) ? '<span style="color: #9ca3af; font-weight: normal; font-style: italic;">Not Provided</span>' : htmlspecialchars($email)) . '</td>
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
                <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 5px;">Client Message</h3>
                <div class="message-box">
                    "' . nl2br(htmlspecialchars($message)) . '"
                </div>
                ' : '') . '
            </div>
            <div class="footer">
                <p>This is an automated operational email sent from your website backend server.</p>
                <p>© 2026 <a href="#">HomeShield Paint Startup</a>. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ';

    // Combine headers and body
    $emailPayload = implode("\r\n", $headers) . "\r\n\r\n" . $emailHtml;

    // Send payload and terminate data sequence with CRLF.CRLF
    fwrite($socket, $emailPayload . "\r\n.\r\n");
    $dataResponse = readSmtpResponse($socket);
    if (substr($dataResponse, 0, 3) !== '250') {
        throw new Exception("SMTP Error: Sending message body failed: $dataResponse");
    }

    // 8. Close SMTP connection
    executeSmtpCmd($socket, "QUIT", 221);
    fclose($socket);

    // Return JSON Success response
    echo json_encode([
        "success" => true,
        "message" => "Lead registered and email sent successfully.",
        "ticketId" => $ticketId
    ]);

} catch (Exception $e) {
    if (isset($socket) && is_resource($socket)) {
        fclose($socket);
    }
    
    // Log the error internally if required
    // error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Failed to send email. " . $e->getMessage()
    ]);
}
