<?php
ini_set("max_execution_time", "-1");
ini_set("memory_limit", "-1");
ignore_user_abort(true);
set_time_limit(0);
require('vendor/autoload.php');

$app = new \Slim\Slim();
$app->add(new \Slim\Middleware\HttpBasicAuthentication([
    "users" => [
        "eytan" => "betachon",
        "user" => "passw0rd"
    ]
]));
$app->post('/login', 'logIn');
$app->get('/client', 'getClients');
$app->get('/invoices', 'getInvoices');

$app->run();

function getClients() {
	$sql = "select client_contact, client_account_number, client_name,client_id, client_percentage, client_note, client_active, client_address_line_1, client_address_line_2, client_zip_code, client_size, client_created_tstamp,	client_modify_tstamp,	client_phone FROM client";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->execute();
		$clients = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		print_r(json_encode($clients));
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getInvoices() {
	$sql = "select invoice_number, account_number, original_amount_due,  net_charge_amount, auditor2, service from invoice limit 500";
	// $sql = "select invoice_number, account_number, original_amount_due,  sum(net_charge_amount), auditor_2, service from invoice group by invoice_number";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->execute();
		$invoices = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		print_r(json_encode($invoices));
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function logIn() {
	$app = \Slim\Slim::getInstance()->request();
	$request = $app->getBody();
	$credentials = json_decode($request);
	if($credentials->email != 'eytan' || $credentials->password != 'betachon') {
		return false;
	}
	
}



function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="danielgutenberg";
	$dbpass="";
	$dbname="betachon_mtmapp";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>