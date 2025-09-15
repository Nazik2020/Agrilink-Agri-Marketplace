
<?php
$languages = ["Python", "Java", "C++", "JavaScript", "PHP", "C#", "Ruby"];
$errors = [];
$selected = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $selected = isset($_POST['languages']) ? $_POST['languages'] : [];

    if (count($selected) !== 3) {
        $errors[] = "Please select exactly 3 programming languages.";
    } else {
        echo "<h3>Your Favorite Programming Languages:</h3><ul>";
        foreach ($selected as $lang) {
            echo "<li>" . htmlspecialchars($lang) . "</li>";
        }
        echo "</ul>";
    }
}
?>

<!-- HTML Form -->
<h2>Select Your Three Favorite Programming Languages</h2>
<?php
if (!empty($errors)) {
    echo "<p style='color:red;'><strong>" . implode("<br>", $errors) . "</strong></p>";
}
?>

<form method="post" action="">
    <?php foreach ($languages as $lang): ?>
        <label>
            <input type="checkbox" name="languages[]" value="<?= $lang ?>"
                <?= in_array($lang, $selected) ? 'checked' : '' ?>>
            <?= $lang ?>
        </label><br>
    <?php endforeach; ?>
    <br>
    <input type="submit" value="Submit">
</form>
