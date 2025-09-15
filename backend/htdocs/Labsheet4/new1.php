<?php
// Student class
class Student {
    private $name;

    // Constructor
    public function __construct($name) {
        $this->name = $name;
    }

    // Study method
    public function study() {
        echo "{$this->name} is studying.<br>";
    }
}

// Lecturer class
class Lecturer {
    private $name;

    // Constructor
    public function __construct($name) {
        $this->name = $name;
    }

    // Teach method
    public function teach() {
        echo "{$this->name} is teaching.<br>";
    }
}

// Course class
class Course {
    protected $name;

    // Constructor
    public function __construct($name) {
        $this->name = $name;
    }

    // Start method
    public function start() {
        echo "The course \"{$this->name}\" has started.<br>";
    }
}

// Create instances
$senuja = new Student("Senuja");
$drKasun = new Lecturer("Dr. Kasun");
$computerScience = new Course("Computer Science");

// Call methods
$senuja->study();
$drKasun->teach();
$computerScience->start();
?>
