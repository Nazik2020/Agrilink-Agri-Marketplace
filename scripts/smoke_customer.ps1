# Customer API Smoke Tests
# Usage: run in PowerShell from repo root
# Ensure XAMPP Apache + MySQL are running.

$Base = "http://localhost/Agrilink-Agri-Marketplace/backend"

function Show-Section($title) {
  Write-Host "`n=== $title ===" -ForegroundColor Cyan
}

try {
  Show-Section "Get Customer Profile"
  $email = Read-Host "Enter customer email to fetch"
  $body = @{ email = $email } | ConvertTo-Json
  $res = Invoke-WebRequest -Uri "$Base/get_customer_profile.php" -Method Post -ContentType "application/json" -Body $body
  $res.Content | Write-Host

  Show-Section "Update Profile (JSON)"
  $orig = $email
  $payload = @{
    originalEmail = $orig
    email         = $orig
    fullName      = "Demo Customer"
    address       = "123 Farm Rd"
    contactNumber = "0771234567"
    country       = "Sri Lanka"
    postalCode    = "20000"
  } | ConvertTo-Json
  $res = Invoke-WebRequest -Uri "$Base/update_customer_profile.php" -Method Post -ContentType "application/json" -Body $payload
  $res.Content | Write-Host

  Show-Section "Update Profile (Multipart with Image)"
  $imagePath = Read-Host "Optional: path to profile image (or press Enter to skip)"
  if ($imagePath -and (Test-Path $imagePath)) {
    $form = @{
      originalEmail = $orig
      email         = $orig
      fullName      = "Demo Customer"
      address       = "123 Farm Rd"
      contactNumber = "0771234567"
      country       = "Sri Lanka"
      postalCode    = "20000"
      profile_image = Get-Item $imagePath
    }
    $res = Invoke-WebRequest -Uri "$Base/update_customer_profile.php" -Method Post -Form $form
    $res.Content | Write-Host
  } else {
    Write-Host "Skipped image upload." -ForegroundColor Yellow
  }

  Show-Section "Login (Session + Remember Me)"
  $password = Read-Host -AsSecureString "Enter password for $email"
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
  $loginBody = @{ email = $email; password = $plain; rememberMe = $true } | ConvertTo-Json
  $res = Invoke-WebRequest -Uri "$Base/Login.php" -Method Post -ContentType "application/json" -Body $loginBody -SessionVariable sess
  $res.Content | Write-Host

  Show-Section "Done"
} catch {
  Write-Error $_
  exit 1
}
