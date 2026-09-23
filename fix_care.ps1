$content = Get-Content -Raw src\pages\BabyCarePage.tsx
$content = $content -replace 'const CareSummaryCard', '// const CareSummaryCard'
Set-Content -Path src\pages\BabyCarePage.tsx -Value $content
