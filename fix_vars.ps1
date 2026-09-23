$content = Get-Content -Raw src\postpartum\pages\PostpartumDashboard.tsx

$content = $content -replace 'const \[diaperLogs, setDiaperLogs\] = useState<number>\(4\);', ''
$content = $content -replace 'const \[activeTab, setActiveTab\] = useState<"overview" \| "baby" \| "recovery">.*', ''
$content = $content -replace 'const \[recentFeedings, setRecentFeedings\] = useState.*?\n\s*\]\);', ''
$content = $content -replace 'const \{ user, vitals, moodLogs, appointments, medicines \} = useApp\(\);', 'const { user } = useApp();'

Set-Content -Path src\postpartum\pages\PostpartumDashboard.tsx -Value $content
