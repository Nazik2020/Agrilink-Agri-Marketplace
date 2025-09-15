<?php
/*
//check if the variable has been set and not null
if(isset($_POST['name'])){
    echo "your name is".$_POST['name'];
}
else{
    echo "please enter your name:";
        
}
if(isset($_POST['name'])){
    echo "your name is ".$_POST['name'];
}
else{
    echo " please enter the your name";
        
}

if(empty($name)){
    echo" please eneter your name:";
}
else{
    echo "your name is .$name";
   
}
$email="chamudya@gmail.com";
//validate the email address
if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
    echo "please enter a valid email address:";
}else{
    //sanitize the email address
    $santized_email=filter_var($email,FILTER_SANITIZE_EMAIL);
    //
    echo "your email address is ".$sanitized_email;
}


*/


//VALIDATE AND SANITIZE Ddata 
$email="chaam@gmail.com ";

$sanitized_email=filter_var($email,FILTER_SANITIZE_EMAIL);
$validates_email=filter_var($sanitized_email,FILTER_VALIDATE_EMAIL);
if($validated_email){
echo "your email address is".$validated_email;
}
else{
    echo "please enter a valid email adrress";
}














