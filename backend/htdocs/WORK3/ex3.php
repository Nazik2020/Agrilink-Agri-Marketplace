<?php

class Product{
    private $name;
    private $price;
    
    //methods 
    //create the construct
    public function __construct($name,$price){
        $this->name=$name;
        $this->price=$price;
    }
        
    //method 
        public function getDetails(){
            return $this->name.$this->price;
        }
        public function getName(){
            return $this->$name;
            
        }
        
    }
    class Customer{
        private $name;
        private $email;
        
        //create a consructer
        public function __construct($name,$email){
            $this->name=$name;
            $this->email=$email;
    }
    
    //make the method for 
   public function placeOrder($product){
       echo $this->name . "has placed order for ";
   }
   public function getName(){
       return $this->name;
   }
   public function getEmail(){
       return $this->email;
   }
   //cleanup tasks
   public function __destruct() {
       echo "good bye,{$this->name} thank you for he shopping";
       ;
   }
    
}
class Order{
    private $customer;
    private $product;
    
   public function construct($customer,$product){
       $this->customer=$customer;
       $this->product=$product;
   }
   public function getOrderDetails(){
       echo "customer name".$this->customer->getName()
       echo "customer email"
       echo "product"
       echo " "
       
   }
    
    
}