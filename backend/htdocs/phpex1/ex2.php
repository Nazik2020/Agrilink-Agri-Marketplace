<?php
//castig integer to string
$age=25;
$age_str=(string)$age;
echo "Age".$age_str."<br>";

$number=34;
$number_str=(string)$number;
echo "Number".$number_str."<br>";

//casting string to integer
$home="500";
$home_str=(int)$home;
echo "Home:".$home_str."<br>";
//casting float to integer
$rate=3.7;
$rate_int=(int)$rate;
echo "Rate:".$rate_int."<br>";

//casting float to integer 
$orange=3.6;
$orange_int=(int)$orange;
echo "orange:".$orange_int."<br>";
//boolean to integer 
$bottle=false;
$bottle_bool=(int)$bottle;
echo "bottle:".$bottle_bool."<br>";

//casting boolean to integer 
$bat=true;
$bat_int=(int)$bat;
echo "bat:".$bat_int."<br>";

$name="chaaam";
$age=23;
echo "mu name is $name and i am $age years old.<br>";

$a=4;
$b=9;
$c=$a+$b;
echo $c."<br>";
$c=$a-$b;
echo $c."<br>";
$c=$a*$b;
echo $c."<br>";
$c=$a/$b;
echo $c;
$c=$a%$b;
echo $c."<br>";
//exponential 
$c=$a**$b;
echo $c."<br>";
//arrays
$my_array=["apple","orange","grapes"];
echo $my_array[0];

$my_array=["name" =>"chamudya","age"=>34,"gender"="female"];
echo $my_array["name"];




?>