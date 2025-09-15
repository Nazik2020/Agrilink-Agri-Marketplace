<!DOCTYPE html>
<html>
    <head><title> formm </title></head>  
    <body>
        <form method="post" action="">
            <div>
            <label>Name:</label><!-- comment --> 
            <input type="text" name="name"><!-- comment --><br><br>
            <label>Email:</label><!-- comment -->
            <input type="text" name="email"><!-- comment --><br><br>
            <!-- button  -->
            <label>Gender:</label><br><!-- comment -->
            <input type="radio" name="male" value="male"> male
            <input type="radio" name="male" value="male"> female<br><br>
            <!--checkbox-->  
            <label>languages</label><br>
             <input type="checkbox" value="usa">USA<!-- comment -->
             <input type="checkbox" value="english">English<!-- <<!-- comment --> 
             <input type="checkbox" value="sihala">Sinhala<br><br>
             <!--selection-->
             <label>Country</label>
             <select name="country">
                 <option value="select a country">
                 <option value="usa">USA</option>
                 <option value="russia">Russia</option><!-- comment -->
                 <option value="yukren">Srilanka</option><!-- comment --><br><br>
             </select><!-- comment -->
             <input type="submit" value="submit"><!-- comment -->
            </div>
             </form>
    </body>
</html> 
<?php 
//check whether the this form submit or not 
if($_SERVER["REQUEST_METHOD"] ==="POST"){
  //get the data from the form and sanitizing
    $name=htmlspecialchars(trim($_POST['name']));
    $email=htmlspeacialchars(trim($_POST['Email']));
    $gender=$_POST['gender'];
    $country=$_POST['country'];
    $lanuges=$_POST['language'];
    
    //open the file and set it as a open mode
    $file=fopen("data.csv","a");
    //write the data to csv
    fputcsv($file,[$name,$email,$gender,$country,$languge]);
    //close the opened file 
    fclose($file);
    //store the session array all the informatio 
    $_SESSION['last_submission']=['name'=>$name,'email'=>$email,'country'=>$country,'gender'=>$gender];
    
    echo "<p style='color':green;'> thank you for the survey information .</p>";
    echo "<p style ='color':yellow;'> do you need to modifi this <a href="edit.php">simply click here</a>.</p>;
    //basic validation 
    $errors=[];
    
    if(empty($name)){
        echo "name is requied";
    }
    if(empty($email)){
        echo "email is requied";
    }
    if(empty($country)){
        echo "coutry is requied";
        
    }
    if(empty($languges)){
        echo "language is requied";   
    }
    //usdde to display validatio error masssage to user 
    if(count($errors>0)){//returns how may errors exist
        //show validation errors
        foreach($eerrors as $error){
            echo "<p style='color:red;'>$error</p>;
                
        }
        echo "<p style='color':green;'> thank you for the survey information .</p>";
       
        
        else{
            //succes display data 
        echo "<h3> Thank you for your submission!</h3>";
        echo "<p><strong>Name:</strong> " . $name . "</p>";
        echo "<p><strong>Email:</strong> " . $email . "</p>";
        echo "<p><strong>Gender:</strong> " . $gender . "</p>";
        echo "<p><strong>Interests:</strong> " . implode(', ', $interests) . "</p>";
        echo "<p><strong>Country:</strong> " . $country . "</p>";
    }  
    else{
    echo "invalid request";
               
    }
    ?>
    
    
}