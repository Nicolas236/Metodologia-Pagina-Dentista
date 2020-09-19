<?php

ini_set('display_errors', 1);
error_reporting( E_ALL );
$from = "fede_z2010@hotmail.com";
$to = "fedebenitez1996@gmail.com";
$subject = "hola mundo";
$message = "Funciona el email loko";;
$headers = "From:" . $from;
mail($to,$subject,$message,$headers);
echo "el email fue enviado."

?>