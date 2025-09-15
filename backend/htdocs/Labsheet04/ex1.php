<!DOCTYPE html>
<html>
    <head>
        <title> form</title>
    </head>
    <body>
        <form>
            <form action="post" method=" ">
            <label> Name:</label> <input type="text name="name"><!-- comment --><br><br>
            <label>Email:</label><input type="text" name="email"><!-- comment --><br><br>
            <label> Phone_no:</label> <iput type="text" name="phone_no"><br><br>
            <input type="submit" name="phone_no">           
        </form>
    </body>
</html>
<?php
//whether  user submit the form or not 
if($_SERVER["REQUEST_METHOD"]=="POST"){
    //to  get the informatio from  sbmitted data form 
    $name=trim($_POST["name"]);
    $email=trim($_POST["email"]);
    $phone_no=trim($_POST["phone_no"]);
    $error=[];
}
if(empty($error)){
    
    //validate the data 
    if(empty($name)){
        $error[]="name is required";
        
    if(empty($email)){
        $error[]="email is requied";
    }
    if(empty($phone_no)){
        $error[]="phone number equired";
    }
    //store i a arra y if no validation array
    if(empty($error)){
        
    }
    if(empty($error)){
        $atendee=[
            "name" => htmlspecialchars($name),
            "email" => htmlspecialchars($email),
            "phone_no" => htmlspespecialchars($phone_no),
           
        ];
        $SESSION[ 'atendee'][][] =$attendee;
        echo "<p style=color:green;'> thank you for registering, <strong>" .$attendee['name'].</strong></p>";
    }
    }
    ?>
    if(!empty($errors)){
        echo "<ul style='color:red;'>";
       foreach($errors as $
            
               

    
    
}
