$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$outSize = (Get-ChildItem -Path "$base\out" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$nmSize = (Get-ChildItem -Path "$base\node_modules" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
Write-Host "out folder: $([math]::Round($outSize/1MB,2)) MB"
Write-Host "node_modules: $([math]::Round($nmSize/1MB,2)) MB"

Write-Host "`nTop 20 node_modules by size:"
Get-ChildItem "$base\node_modules" -Directory | ForEach-Object {
    $s = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    [PSCustomObject]@{Name=$_.Name; SizeMB=[math]::Round($s/1MB,2)}
} | Sort-Object SizeMB -Descending | Select-Object -First 20 | Format-Table -AutoSize
