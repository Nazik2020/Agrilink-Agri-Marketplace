
<?php
session_start();

$filename = "data.csv";

// Initialize
$rows = [];
$editIndex = isset($_POST['edit']) ? (int)$_POST['edit'] : null;
$updateIndex = isset($_POST['update']) ? (int)$_POST['update'] : null;

// Step 1: Read all rows
if (file_exists($filename)) {
    $file = fopen($filename, "r");
    while (($row = fgetcsv($file)) !== false) {
        $rows[] = $row;
    }
    fclose($file);
}

// Step 2: Handle update
if ($updateIndex !== null && isset($_POST['name'], $_POST['email'], $_POST['gender'], $_POST['country'])) {
    $rows[$updateIndex] = [$_POST['name'], $_POST['email'], $_POST['gender'], $_POST['country']];
    // Save all rows back to file
    $file = fopen($filename, "w");
    foreach ($rows as $row) {
        fputcsv($file, $row);
    }
    fclose($file);
    echo "<p style='color:green;'>✅ Response updated successfully.</p>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Survey Responses</title>
</head>
<body>
    <h2>Survey Responses with Edit Option</h2>

    <table border="1" cellpadding="8">
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Country</th>
            <th>Action</th>
        </tr>

        <?php foreach ($rows as $index => $row): ?>
            <?php if ($editIndex === $index): ?>
                <!-- Editable Row -->
                <form method="post">
                    <tr>
                        <td><?= $index + 1 ?></td>
                        <td><input type="text" name="name" value="<?= htmlspecialchars($row[0]) ?>"></td>
                        <td><input type="email" name="email" value="<?= htmlspecialchars($row[1]) ?>"></td>
                        <td>
                            <input type="radio" name="gender" value="Male" <?= ($row[2] === 'Male') ? 'checked' : '' ?>> Male
                            <input type="radio" name="gender" value="Female" <?= ($row[2] === 'Female') ? 'checked' : '' ?>> Female
                        </td>
                        <td><input type="text" name="country" value="<?= htmlspecialchars($row[3]) ?>"></td>
                        <td>
                            <input type="hidden" name="update" value="<?= $index ?>">
                            <input type="submit" value="Save">
                        </td>
                    </tr>
                </form>
            <?php else: ?>
                <!-- Regular Row -->
                <tr>
                    <td><?= $index + 1 ?></td>
                    <td><?= htmlspecialchars($row[0]) ?></td>
                    <td><?= htmlspecialchars($row[1]) ?></td>
                    <td><?= htmlspecialchars($row[2]) ?></td>
                    <td><?= htmlspecialchars($row[3]) ?></td>
                    <td>
                        <form method="post" style="margin:0;">
                            <input type="hidden" name="edit" value="<?= $index ?>">
                            <input type="submit" value="Edit">
                        </form>
                    </td>
                </tr>
            <?php endif; ?>
        <?php endforeach; ?>
    </table>
</body>
</html>
