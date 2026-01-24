$filePath = "c:\Users\pragy\Downloads\lms-web-application-ui\app\page.tsx"

# Read file content treating it as UTF8
$content = Get-Content -LiteralPath $filePath -Raw -Encoding UTF8

# Define replacements using hashtable
$replacements = @{
    'Ã°Å¸â€œÅ¡' = '📚';
    'Ã¢Å“Â Ã¯Â¸Â ' = '✍️';
    'Ã°Å¸â€ Â¬' = '🔬';
    'Ã°Å¸Â â€ ' = '🏆';
    'Ã°Å¸â€œÅ ' = '📊';
    'Ã°Å¸â€˜Â¤' = '👤';
    'Ã¢Å“â€œ' = '✓';
    'Ã°Å¸Å½â€œ' = '🎓';
    'Ã°Å¸â€œË†' = '📈';
    'Ã¢Å¡â„¢Ã¯Â¸Â ' = '⚙️';
    'Ã‚Â©' = '©'
}

# Perform replacements
foreach ($key in $replacements.Keys) {
    if ($content.Contains($key)) {
        $content = $content.Replace($key, $replacements[$key])
        Write-Host "Replaced $key with $($replacements[$key])"
    }
}

# Write back to file
[IO.File]::WriteAllText($filePath, $content)
Write-Host "Encoding fix complete."
