<?php 
for($i=0;$i<100;$i++){
    if($i%3==0 && $i%5==0){
        echo "fizzbuzz";
    }elseif ($i%3==0){
        echo "fizzz";
    }
    elseif($i%4 ==0){
        echo "buzz";
    }
 else {
      echo $i."<br>";
 }
}
?>
