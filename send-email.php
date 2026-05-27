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
$name     = isset($data['name']) ? trim($data['name']) : '';
$phone    = isset($data['phone']) ? trim($data['phone']) : '';
$email    = isset($data['email']) ? trim($data['email']) : '';
$pincode  = isset($data['pincode']) ? trim($data['pincode']) : '';
$service  = isset($data['service']) ? trim($data['service']) : '';
$message  = isset($data['message']) ? trim($data['message']) : '';
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

// -----------------------------------------------------------------
// Brevo Transactional Email configuration (HTTPS API)
// -----------------------------------------------------------------
$apiKey   = getenv('BREVO_API_KEY');
$fromEmail = getenv('BREVO_FROM_EMAIL') ?: 'acac05001@smtp-brevo.com';
$fromName  = 'HomeShield Paint Services';
$toEmail   = getenv('BREVO_TO_EMAIL') ?: 'connect.homeshield@gmail.com';

if (empty($apiKey)) {
    // No API key – inform client but consider lead registered
    http_response_code(200);
    echo json_encode([
        "success"   => true,
        "message"   => "Lead registered successfully. Email delivery is pending — set BREVO_API_KEY in Render env.",
        "ticketId"  => $ticketId,
        "emailSent" => false
    ]);
    exit;
}

// -----------------------------------------------------------------
// Build email payload for Brevo transactional API
// -----------------------------------------------------------------
$subject = "New HomeShield Lead Registered [{$ticketId}]";

$emailHtml = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"utf-8\">\n<title>New Inspection Request</title>\n<style>\nbody {font-family: \"Segoe UI\", Tahoma, sans-serif; background:#f3f4f6; color:#1f2937; margin:0; padding:20px;}\n.container {max-width:600px;margin:auto;background:#fff;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);border:1px solid #e5e7eb;}\n.header {background:#050e1e;padding:40px 30px;text-align:center;border-bottom:4px solid #e2a83a;}\n.logo {color:#fff;font-size:24px;font-weight:800;letter-spacing:2px;text-transform:uppercase;}\n.logo span {color:#e2a83a;}\n.badge {display:inline-block;background:rgba(226,168,58,0.15);border:1px solid rgba(226,168,58,0.3);color:#e2a83a;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;padding:6px 12px;border-radius:9999px;margin-top:10px;}\n.content {padding:40px 30px;}\n.title {font-size:20px;font-weight:700;color:#050e1e;margin:0 0 20px;}\n.grid {width:100%;border-collapse:collapse;margin-bottom:30px;}\n.grid th {text-align:left;padding:12px 16px;background:#f9fafb;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7280;width:35%;border-bottom:1px solid #f3f4f6;}\n.grid td {padding:12px 16px;font-size:14px;font-weight:600;color:#111827;border-bottom:1px solid #f3f4f6;}\n.message-box {background:#f9fafb;border-left:4px solid #e2a83a;padding:16px;font-size:14px;font-style:italic;color:#374151;border-radius:0 12px 12px 0;margin-top:10px;}\n.footer {background:#f9fafb;padding:24px 30px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;}\n.footer a {color:#e2a83a;text-decoration:none;font-weight:bold;}\n</style>\n</head>\n<body>\n<div class=\"container\">\n<div class=\"header\"><h1 class=\"logo\">HOME<span>SHIELD</span></h1><span class=\"badge\">Inspection Registry Lead</span></div>\n<div class=\"content\"><h2 class=\"title\">New Service Lead Registered</h2>\n<p style=\"font-size:14px;color:#4b5563;margin-bottom:25px;line-height:1.5;\">A new home diagnostic or service booking enquiry has been received.</p>\n<table class=\"grid\">\n<tr><th>Appointment Code</th><td style=\"color:#e2a83a;font-family:monospace;font-size:16px;font-weight:900;\">' . htmlspecialchars($ticketId) . '</td></tr>\n<tr><th>Client Name</th><td>' . htmlspecialchars($name) . '</td></tr>\n<tr><th>Phone Number</th><td>' . htmlspecialchars($phone) . '</td></tr>\n<tr><th>Email Address</th><td>' . (empty($email) ? '<span style=\"color:#9ca3af;font-weight:normal;font-style:italic;\">Not Provided</span>' : htmlspecialchars($email)) . '</td></tr>\n<tr><th>Postal Pin Code</th><td>' . htmlspecialchars($pincode) . '</td></tr>\n<tr><th>Requested Service</th><td>' . htmlspecialchars($serviceName) . '</td></tr>\n</table>\n' . (!empty($message) ? '<h3 style=\"font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:5px;\">Client Message</h3><div class=\"message-box\">"' . nl2br(htmlspecialchars($message)) . '"</div>' : '') . '\n</div>\n<div class=\"footer\"><p>This is an automated operational email sent from your website backend server.</p><p>&copy; 2026 <a href=\"#\">HomeShield Paint Services</a>. All rights reserved.</p></div>\n</div>\n</body>\n</html>";

$payload = [
    "sender" => ["name" => $fromName, "email" => $fromEmail],
    "to" => [["email" => $toEmail]],
    "subject" => $subject,
    "htmlContent" => $emailHtml
];

$ch = curl_init('https://api.brevo.com/v3/smtp/email');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'api-key: ' . $apiKey,
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode([
        "success"   => true,
        "message"   => "Lead registered & email dispatched via Brevo API.",
        "ticketId"  => $ticketId,
        "emailSent" => true
    ]);
    exit;
}

// If we reach here, email dispatch failed
http_response_code(500);
$errorMsg = "Email dispatch failed";
if ($curlErr) {
    $errorMsg .= ": {$curlErr}";
} else {
    $errorMsg .= ": HTTP {$httpCode} response";
}

echo json_encode([
    "success" => false,
    "error"   => $errorMsg,
    "brevoResponse" => $response
]);
?>
