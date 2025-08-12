Write-Host "🚀 Starting Agrilink PHP Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Backend APIs will be at: http://localhost:8080/backend/" -ForegroundColor Cyan
Write-Host "Order History API: http://localhost:8080/backend/order_history/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "Keep this window open while using the application" -ForegroundColor Yellow
Write-Host ""

# Change to the project directory
Set-Location -Path $PSScriptRoot

# Check if PHP is installed
try {
    $phpVersion = php -v 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PHP Found: $($phpVersion[0])" -ForegroundColor Green
    } else {
        throw "PHP not found"
    }
} catch {
    Write-Host "❌ PHP is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PHP and add it to your system PATH" -ForegroundColor Red
    Write-Host "Download from: https://www.php.net/downloads" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit
}

# Start the PHP server
Write-Host "🔄 Starting PHP development server..." -ForegroundColor Blue
Write-Host ""

try {
    php -S localhost:8080
} catch {
    Write-Host "❌ Failed to start PHP server" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
