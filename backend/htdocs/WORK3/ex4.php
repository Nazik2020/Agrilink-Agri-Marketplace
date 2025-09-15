<?php
//validate email addrres and sanitize phone-number
if($_SERVER["REQUEST_METHOD"] == "POST"){
    //  retrive and sanitize the iputs
    $name=htmlspeacialchars(trim($_POST['name']));
    $email=trim($_POST['email']);
    $phone=preg_replace('/[^0-9]/'),'',$_POST['phone']);
    $error=[];
    
    //validate the email
    if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
        $errors[]="inavalid email address";
        
    }
    //validate phone
    if(strlen($phone)<10){
        $error[]="phone umber sholid conatain 10 dihits exactly";
       }
       
    
}