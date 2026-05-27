<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// ─── FIX: Handle CORS preflight OPTIONS requests.
//     Browsers send an OPTIONS request before cross-origin POST requests.
//     We must respond with 200 OK and the appropriate CORS headers.
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

// =========================================================================
// 🚀 DEPLOYMENT ARCHITECTURE RESOLUTION (Render Free Tier Outbound Port Block)
// =========================================================================
// Render blocks outbound SMTP traffic on ports 25, 465, and 587 on their Free tier.
// To bypass this firewall block at zero cost, we use Brevo's HTTPS Web API (formerly Sendinblue).
// This runs over standard HTTPS (Port 443), which is NEVER blocked, providing 300 free emails/day!
//
// SETUP INSTRUCTIONS:
// 1. Sign up for a free account at https://www.brevo.com (no credit card needed).
// 2. Go to your Account Menu (top right) -> "SMTP & API" and generate a free API Key.
// 3. In Render Dashboard -> Your Web Service -> Environment -> Add Environment Variable:
//       Key:   BREVO_API_KEY
//       Value: your-brevo-api-key-here
// =========================================================================
$brevoApiKey = getenv('BREVO_API_KEY');
$senderEmail = "Lakshayb057@gmail.com";
$toEmail = "connect.homeshield@gmail.com";

// ─── FIX: Early validation of BREVO_API_KEY.
//     If the key is missing or clearly invalid, return a graceful response
//     instead of proceeding to the API call and crashing with HTTP 500.
//     The lead data is still saved client-side in localStorage.
if (empty($brevoApiKey)) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Lead registered successfully. Email delivery is pending — please set the BREVO_API_KEY environment variable on Render to enable email notifications.",
        "ticketId" => $ticketId,
        "emailSent" => false
    ]);
    exit;
}

// Prepare beautifully designed HTML Email template
$subject = "New HomeShield Lead Registered [{$ticketId}]";

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

// Execute the Web API HTTPS POST request to Brevo
$url = "https://api.brevo.com/v3/smtp/email";

$payload = [
    "sender" => ["name" => "HomeShield Paint Services", "email" => $senderEmail],
    "to" => [["email" => $toEmail, "name" => "HomeShield Owner"]],
    "subject" => $subject,
    "htmlContent" => $emailHtml
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "api-key: " . $brevoApiKey,
    "Content-Type: application/json",
    "Accept: application/json"
]);

// Execute and capture response
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode([
        "success" => true,
        "message" => "Lead registered and email sent securely via Brevo Web API.",
        "ticketId" => $ticketId
    ]);
} else {
    // If the Brevo key is missing/invalid, fallback to a clean mock message or throw a helpful error
    if (empty($brevoApiKey) || strpos($brevoApiKey, "xkeysib") === false) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Email server configuration incomplete. Please provide a valid Brevo API key inside send-email.php to bypass Render SMTP blocks."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Failed to dispatch email via Web API. Response Code: " . $httpCode . ". Error: " . $response . " " . $curlError
        ]);
    }
}
