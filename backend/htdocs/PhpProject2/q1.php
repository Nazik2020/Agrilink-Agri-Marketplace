<?php

$num=4;
$word="chamudya";
$message="my name is " .$word." and i am ".$num." years old.";
echo $message."<br>";

$num1=2000;
if
($num1%4==0){
echo "this is leap year.<br>";
}
else{
    echo " this is not.<br>";
}
$day=3;
switch($day){
    case 1:
        echo "monday";
        break;
     case 2:
        echo "tuesday";
        break;
    case 3:
       echo "wednsday.<br>";
       break;
    case 4:
        echo "thursday";
        break;
   case 5:
       echo "friday";
       break;
    default:
        echo "invalid day";

}
$name="chamudya";
$age=45;
$gender="male";
$city="newyork";
$mesaage ="my name is .$name. my age is .$age. my gender is .$gender. i am living in $city .";
echo $message ."<br>";

$p_array=["panadura","bandaragama","ramukkana","horana"];
for($i=0;$i<3;$i++){

print_r ($p_array);
}
 $f_fruits=["apple","orange","grapes","banana"];
 foreach($f_fruits as $f_fruits){
 echo $f_fruits ." is a fruit.<br>";
 }
 
 for ($num=0;$num<100;$num++){
    if($num%3==0);
     echo  $num."<br>";
 }
 
// Initialize variables
$first = 0;
$second = 1;
$count = 0;

// Loop to print first 10 Fibonacci numbers
while ($count < 10) {
    echo $first . "<br>"; // Print current Fibonacci number

    // Calculate the next number
    $next = $first + $second;
    $first = $second;
    $second = $next;

    $count++;
}





















 
?>