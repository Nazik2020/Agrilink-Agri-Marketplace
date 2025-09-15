<?php

//open the data.cv and read it each rows and atore in arrat
if(file_exists($filename)){
    $file=fopen($filename,"r");
    while(($row=fgetcsv($file))) !=false){
        $rows[]=$row;
    }
    fclose($file);
}
//to hadle the update
