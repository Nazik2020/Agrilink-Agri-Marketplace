<!DOCTYPE html>
<html> <head><title> form registration</title></head>
    <body>
        <form method="post" action ="" >
            <label>phone number</label>
            <input type="text" name="phone"><br><br>
            <input type="submit" name="submit">
        </form>
        <?php if(!empty($message)):?>
        echo "<p> $message </p>";
        <?php endif 
        ?>
           

<?php
//to validate first check whether the form submutted or nor 
//POST method 
$phone=$message="";


if($_SERVER["REQUEST_METHOD"]=="POST"){
    $phone=trim($_POST['phone']);//saitize the phone number 
    //validation part
    //remove the unwanted unnecassary character 
    $cleanedphone_number=preg_replace('/[^0-9]/','',$phone);
    //check if it is 10 character 
    if(preg_match('/^\d[10]$/',$cleanedphone_number)){ //check the phone number aftr the checkk the if speacila chracters exist
        $message ="valid";
    }else{
         $message="invalid";   
    }
}
if(!empty($message)){
    echo "<p>$message</p>";

}
?>
    </body>
</html>