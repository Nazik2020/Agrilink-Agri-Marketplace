<?php
class Student{
    public $name;
    public $age;
    public $grade;
    public $subject=[];
    
    
    //intialize the name and age 
    public function __construct($name,$age){
        $this->name=$name;
        $this->age=$age;
        
}
//add subject 
public function addSubject($subject){
    $this->subject[]=$subject;   
}
//get subject 
public function getSubject(){
   return $this->subject;
   
}
//get grade
public function getGrade(){
     return $this->grade;
}
//set grade 
public function setGrade($grade){
    $this->grade=$grade;
}
//get age
public function getAge(){
    return $this->age;
}
}
//get the user inputs 
echo "enter the name:";
$name=trim(fgets(STDIN));//read user input whe they typed somthinfg and enter 
                          //trim- use for remove the unnessary space sin user inputs 

 echo "eneter the age";
 $age=trim(fgets(STDIN));
 

//create student object
$student=new Student($name,$age);
 
echo "enetr the grade";
$grade=trim(fgets(STDIN));
//SET THE GRADE 
$student->setGrade($grade);

//add subjects 
echo "eneter the three subjects ";
for($i=0;$i<=5;$i++){
  echo "$subject $i";
  $subject=trim(fgets(STDIN));
 $student->addSubject($subject);
}
 //display the information 
echo "Name:".$student->getName();
echo "Age:".$student->getAge();
echo "Grade:".$student->getGrade();

echo "suject enrolled";
foreach($student->$subject() as $subj);{  //foreach loop  foreach($array as $value) in here ($student->$subject()as $subj
   
echo" $subj";      
}
?>