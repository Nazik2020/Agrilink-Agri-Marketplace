<?php
/*
echo rand(10,40)."<br>";
echo round(3.456)."<br>";

$animal=array("dog","cat","bear","cow");
echo strlen($animal)."<br>";



$number=range(20,30);
print_r($number)."<br>";

 echo $count($number);


// String array
$fruits = array("apple", "banana", "orange", "grape", "pineapple");

// Get the length of the array
$length = count($fruits);

echo  $length."<br>";

$vegetables=array("beans","pumpkin","karrot");
$length =count($vegetables);
echo $length."<br>";

array_shift($vegetables);
print_r($vegetables);
unset($vegetables[1]);
print_r($vegetables);
 
array_push($vegetables,78);
print_r($vegetables);

array_pop($vegetables);
print_r($vegetables)."<br>";

array_shift($vegetables);
print_r($vegetables);

$vehicles=array("car","van","bus","cycle");
array_slice($vehicles);
print_r($vehicles);


$number=range(20,30);
$length=count($number);
echo $length;

array_shift($number);
print_r ($number);

array_pop($number);
print_r ($number);

array_push($number,50,89);
print_r ($number);

$welcome="i am going to home today ";
$welcomeArray=explode(" ",$welcome);
print_r($welcomeArray);

echo pow(3,3);

$number=array(4,5,6,7);
echo min($number)."<br>";
echo max($number);

echo rand(10,20);
 
$number=array(45,6,78,90,23);
$reverced=array_reverse($number);
print_r($reverced);



// File path (make sure this path exists or use a relative path)
$file = "Test.txt";

// Text to write
$text = "Hello World";

// Write the text to the file
file_put_contents($file, $text);

echo "Text written successfully to Test.txt";

$filename = "Test.txt";

// Check if it's a file
if (is_file($filename)) {
    // Read and display the content
    $content = file_get_contents($filename);
    echo "File Content: " . $content;
} else {
    echo "The file does not exist or is not a regular file.";
}

// Set the file name
$filename = "Test.txt";

// Set the content to write
$content = "Hello World";

// Create and write to the file
file_put_contents($filename, $content);

echo "File 'Test.txt' created and 'Hello World' written successfully.";
?>

*/

// Step 1: Define the file name
$filename = "Test.txt";

// Step 2: Define the content to write
$content = "Hello World";

// Step 3: Create the file and write the content
file_put_contents($filename, $content);

// Step 4: Output success message
echo "File 'Test.txt' created and 'Hello World' written successfully.";

?>




























