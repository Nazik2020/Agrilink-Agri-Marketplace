<?php 
//defining the class 
class Book{
    //define the propperties
    public $title;
    public $author;
    public $year;
    
    
    //create a constructer 
    public function __construct($title,$author,$year){
        //intilizing the properties 
        $this->title=$title;
        $this->author=$author;
        $this->year=$year;
        //implement the getter methods for properties 
    }
    public function getTitle(){
        return $this->title;
        
    }
    public function getAuthor(){
          return $this->author;
    }
    public function getYear(){
        return $this->year;
    } 
        //set theyear to get the year updates 
        public function setYear($year){
            $this->year=$year;
        }
    }
    //create  a new constructer and add values 
    $book=new Book("hathpana","kumarathunga munidasa",1960);
   //display the book info
    echo "Book title :".$book->getTitle()."<br>";
    echo "Book author :".$book->getAuthor()."<br>";
    echo "Book Year:".$book->getYear()."<br><br>";
    
    $book->setYear(1980);
    
    echo "Updates information.<br>";
    
    echo "Book title:". $book->getTitle()."<br>";
    echo "Book author:"  .$book->getAuthor()."<br>";
    echo "Book Year:"  .$book->getYear()."<br>";
    ?>
