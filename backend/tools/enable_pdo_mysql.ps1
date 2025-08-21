$ErrorActionPreference = 'Stop'

$iniPath = 'C:\Program Files\php-8.4.11-Win32\php.ini'

if (-not (Test-Path -LiteralPath $iniPath)) {
  throw "php.ini not found: $iniPath"
}

# Read entire file
$raw = Get-Content -LiteralPath $iniPath -Raw

# 1) Ensure extension_dir points to ext folder (forward slashes)
$extLine = 'extension_dir="C:/Program Files/php-8.4.11-Win32/ext"'
if ($raw -match '(?m)^\s*;?\s*extension_dir\s*=') {
  $raw = [regex]::Replace($raw, '(?m)^\s*;?\s*extension_dir\s*=.*$', $extLine)
} else {
  $raw += "`r`n$extLine"
}

# Helper to enable a given extension name
function Enable-PhpExtension([string]$name, [string]$content) {
  # If commented, uncomment
  if ($content -match "(?m)^\s*;\s*extension\s*=\s*$name\s*$") {
    $content = [regex]::Replace($content, "(?m)^\s*;\s*extension\s*=\s*$name\s*$", "extension=$name")
    return $content
  }
  # If already enabled, keep
  if ($content -match "(?m)^\s*extension\s*=\s*$name\s*$") {
    return $content
  }
  # Otherwise append
  return $content + "`r`nextension=$name"
}

$raw = Enable-PhpExtension -name 'pdo_mysql' -content $raw
$raw = Enable-PhpExtension -name 'mysqli' -content $raw

# Write back
Set-Content -LiteralPath $iniPath -Value $raw -Encoding ASCII
Write-Host 'php.ini updated. Enabled: pdo_mysql, mysqli; set extension_dir.'
