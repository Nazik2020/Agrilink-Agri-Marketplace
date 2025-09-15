<!DOCTYPE html>
<html>
    <head>
        <title>form </title>
    </head>
    <body>
        <?php
    //if there is a no error show the succes message 
        if(!empty($success)){
            echo $success;
        }
   //if there is a error message then display them also
        if(!empty($error)){
            echo $error;
        }
       ?>
        <form method="post" action=" ">
                
            <label>Name:</label>
            <input type="text" name="name"><br><br>
              <label>Email:</label>
            <input type="text" name="name"><br><br>
              <label>Contact</label>
               <input type="text" name="contact"><br><br>
                 </form>
                <div class="attendee-list">
                <h2>attendee list</h2>
                //check whether the attendee array is empty or no 
                <?php
                if(!empty($_SESSION['attendee']))?>
        
                <table>
                    <tr>
                        <th>name</th><!-- comment -->
                        <th>email</th><!-- comment -->
                        <th> Contact</th>
                    </tr><!-- comment -->
                    <?php foreach($_SESSION['attendees'] as $attendee)?>
                    <tr>
                    <td><?php echo htmlspecialchars($attendee['name'])?></td>
                    <td><?php echo htmlspecialchars($attendee['email'])?></td>
                    <td><?php echo htmlspecialchars($attendee['contact'])?></td>
                    </tr>
                    <?php endeach;?>
                </table>
                            
           </body>
            </html>
  <?php
  
  //first create the attedee array
  if(!isset($_SESSION['attendee'])){
      $_SESSION['attendee']=[];
  }
  
  
  //declare the varibles add the values
  $name=$email=$contact=" ";
  $error=[];
  $success=" ";
  
  
  
  //first check whether form submitted or not 
  if($_SERVER["REQUEST_METHOD"]=="POST"){
      //sanitize the inputs 
      $name=htmlspecialchars(trim($_POST['name']));
      $email=htmlspecialchars(trim($_POST['email']));
      $contact=htmlspecialchars(trim($_POST['contact']));
      
  
  //validate the inputs 
  if(empty($name)){
      $error[]="name is required";
      
  }
  if(empty($email)){
      $error[]="email is requied";
  }
  elseif(!filter_var($email,FILTER_VALIDATE_EMAIL)){
      $error[]="invalid email format";
  }
  if(empty($contact)){
      $error[]="contact is required";
  }
  //then if no error ,store the attendee
  if(empty($error)){
      $_SESSION['attendee'][]=[
          'name'=>$name,'email'=>$email,'contact'=>$contact
      ];
      $sucess="registration succefull!";
      //clear the values 
      $name=$email=$contact=" ";
          
  }
      
  }
  
  