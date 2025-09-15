<?php
if(!isset($_SESSION['atendee'])){
    $_SESSION[' attendees'] =[];
}
//definig variables set values
$name=$email=$phone_no=" ";
$error=[];
$succesMsg=" ";

//if the form is submitted or not 
if($_SERVER["REQUEST_METHOD"] =="POST"){
    //trim and sanitize
    $name=trim($_POST["name"]);
    $email=trim($_POST[" email"]);
    $phone_no=trim($_POST ["phone_no"]);
    
    //validation
   if(empty($name)){
       $error[]="name is requied";
   }
   elseif(!filter_var($email,FILTER_VALIDATE_EMAIL)){
       $error[]="inavalid email address";
   }
   if(empty($conatct)){
       $error[]="inavalid password";
        
       
       if(empty($error)){
           $attendee=[
               "name" =>htmlspeacialchars($name),
               "email" => htmlspeacialchars($email),
               "phone_no" =>htmlspeacialchars($phone_no),
               ];
       /* "name" =>"john de silava"
        * "email" =>"john@gmail.com"
        * "phone_no =>"3456789089"
        */
           $_SESSION['attendee'][]=$attendee;
           
           //if no error and  all infor set this message will ap[ear
           $succesMsg="Regidtration is succefull<strong>{$attendee['name']} </strong>";
       }
   }
   ?>
<!DOCTYPE html>
<html>
    <head><title> form registration</title>
    </head>
    <body>
        
    </body>
</html>
   
               