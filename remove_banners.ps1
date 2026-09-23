$content = Get-Content -Raw src\postpartum\pages\PostpartumDashboard.tsx

$oldStart = '{/* DAILY CHECK-IN */}'
$oldRegex = '(?s)\{\}\s*<section className="relative bg-rose-900.*?</section>'
$content = $content -replace $oldRegex, ''

$oldRegex2 = '(?s)\{\}\s*<section className="relative bg-purple-900.*?</section>'
$content = $content -replace $oldRegex2, ''

$oldRegex3 = '(?s)\{/\* 3\.5 AGENT 1.*?Ask Coordination AI.*?</button>\s*</section>'
$content = $content -replace $oldRegex3, ''

$oldRegex4 = '(?s)\{\}\s*<section className="relative bg-teal-900.*?</section>'
$content = $content -replace $oldRegex4, ''

$oldRegex5 = '(?s)\{\}\s*<section className="relative bg-amber-900.*?</section>'
$content = $content -replace $oldRegex5, ''

$oldRegex6 = '(?s)\{\}\s*<section className="relative bg-indigo-900.*?</section>'
$content = $content -replace $oldRegex6, ''

Set-Content -Path src\postpartum\pages\PostpartumDashboard.tsx -Value $content
