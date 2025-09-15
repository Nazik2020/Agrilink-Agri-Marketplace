<?php
class Book{
    private $title;
    private $author;
    private $year;
    
    public function __construct($title, $author, $year){
        $this->title = $title;
        $this->author = $author;
        $this->year = $year;
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
    
    public function setYear($year){
        $this->year = $year;
    }
}

$b = new Book("Hath Pana", "Kumarathunga Munidasa", 1960);
echo "Book Title: ".$b->getTitle()."<br>";
echo "Book Author: ".$b->getAuthor()."<br>";
echo "Publication Year: ".$b->getYear()."<br>";

$b->setYear(1962);

echo "====Updated Details======<br>";
echo "Book Title: ".$b->getTitle()."<br>";
echo "Book Author: ".$b->getAuthor()."<br>";
echo "Publication Year: ".$b->getYear()."<br>";

?>

