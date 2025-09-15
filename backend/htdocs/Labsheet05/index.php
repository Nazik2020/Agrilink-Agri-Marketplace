<?php
//create class
class Animal{
    protected $name;
    
    //constructor to inilize name 
    public function __construct($name){
           $this ->name =$name;
           
}
//ther is a common fuction eating
public function eat(){
    echo "{$this->name} is eating.<br>";
    
}
}
//then agai create the cat class but extends from animal classs

class Dog extends Animal{
    public function play(){
        echo "{$this->name} is playing.<br>";
    }
}
class Cat extends Animal{
    //climb function 
    public function climb(){
    echo "{$this->name} is climbing.<br>";
}
}
//create instances
$lucky=new Dog("Lucky");
$bunty=new Cat("Bunty");

//call methos to the sho wthw setences 
$lucky->play();
$lucky->eat();
$bunty->climb();
$bunty->eat();

?>