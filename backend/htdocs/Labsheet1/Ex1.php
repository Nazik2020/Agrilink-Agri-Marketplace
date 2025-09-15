<?php
$fruits=array("apple","orange","grapes");
$my_array=[2,4,5];
print_r($my_array);

$numbers=array(3,4,5,6,7);
foreach($numbers as $number){
   echo $number ."is a number.<br>";
}

for($i=0;$i<100;$i++){
    if($i%5==0){
       echo $i."<br>";
    }
}
