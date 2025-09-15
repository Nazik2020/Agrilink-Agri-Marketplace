<?php

if(!isset($_SESSION['attendee'])){
    $_SESSION['attendee']=[];
}
//declare varibles add values
$name=$email=$contact=" ";
$errors=[];
$success=" ";

//whether form submit or not 
if($_SERVER["REQUEST_METHOD"] ==="POST"){
    
    //sanitize inputs
    $name= htmlspecialchars($_POST['name']);
    $email= htmlspecialchars($_POST['email']);
    $contact= htmlspecialchars($_POST['contact']);
    
    //validation 
    if(empty($name)){
        $errors[]="name is required";
        
    }
    if(empty($email)){
        $errors[]=" email is required";
    }
     elseif (!filter_var($email,FILTER_VALIDATE_EMAIL)){
         $errors[]="invalid email";
         
     }
     if(empty($contact)){
         $error="contact number is empty";
     }
     //if no errors ,store data 
     if(empty(errors)){
         $attendee=[
             "name" => $name,
              "email" => $email,
              "contact" => $contact
         ];
                 
      $_SESSION['attendee'][]=$attendee;
      $success = "succefull registration";
      $name=$email=$contact=" ";
     }
}
?>     
  <!DOCTYPE html>
  <html>
      <head>
          <title> form </title>
      </head>
      <body>
          <form method="post" action=" "> 
              <label>Name:</label>
              <input type="text" name="name"><!-- comment --><br><br>
              <label>Email</label><!-- comment --><!-- comment -->
              <input type="text" name="email"><!-- comment --><br><br>
              <label>Contact:</label><!-- comment -->
              <input type="text" name="contact"><br><br>
              <input type="submit" name="register";
          </form>
          </body>
  <div class="list-container">
    <h2>Registered Attendees</h2>
    <?php if (!empty($_SESSION['attendees'])): ?>
        <ul>
            <?php foreach ($_SESSION['attendees'] as $a): ?>
                <li>
                    <strong><?= htmlspecialchars($a['name']) ?></strong><br>
                    Email: <?= htmlspecialchars($a['email']) ?><br>
                    Contact: <?= htmlspecialchars($a['contact']) ?>
                </li>
                <hr>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>No attendees registered yet.</p>
    <?php endif; ?>
</div>
   
          