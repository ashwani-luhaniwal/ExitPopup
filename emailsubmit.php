<?php

	if (!empty($_POST['emailTo'])) {
		$to = $_POST['emailTo'];
	}
	else {
		$to = "lead@currenciesdirect.com";
	}

    if(!empty($_POST['data'])){
		$from = $_POST['data']; // sender's Email address.
	}
	else {
		$from = "ngop@currenciesdirect.com";
	}

	$referer = $_POST['data'];
	$rating = $_POST['data'];

    $subject = "New Lead Information";
	$message = "We have received a new lead information.";

    $headers = "From: " . $from . "\r\n";
	$headers .= 'Content-Type: text/plain; charset=utf-8';
    mail($to, $subject, $message, $headers); // mail sent to the primary location

    echo "Mail Sent";
?>
