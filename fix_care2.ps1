$content = Get-Content -Raw src\pages\BabyCarePage.tsx
$content = $content -replace '(?s)const CareSummaryCard: React\.FC<\{.*?</svg>\s*</div>\s*\);\s*};', ''
Set-Content -Path src\pages\BabyCarePage.tsx -Value $content
