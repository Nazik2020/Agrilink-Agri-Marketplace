<?php
if($_SERVER["REQUEST_METHOD"]=="GET" && isset($_GET['submit'])){
    $selectedColor=isset($_GET['color'])?trim($_GET['color']):'';  //store the color that get from the form 
     
   if($selectedColor !== ''){
       echo "<p style='color:$selectedColor;'>you selected:<strong>$selectedColor</strong></p>";
   }else{
        echo "<p style='color:red;'> Please select a color from the dropdown list .</p>";
}
}
?>
<!DOCTYPE html>
<html>
<body>
<h2>select the color</h2>
<form method="GET" action=" " >
    <lable for="color" >choose color<lable>
        <select name="color"id="color">
            <option value="red">red</option>"
            <option value="green">green</option>
            <option value="orange">orange</option>
               </select>
               <br><br>
               <input type="submit" name ="submit" value="submit">
               </form>
               </body>
               </html>
               
               
        
        