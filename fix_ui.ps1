$content = Get-Content -Raw src\postpartum\pages\PostpartumDashboard.tsx

$content = $content -replace '<section className="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">', '<section className="relative bg-rose-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-rose-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: "url(''https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200'')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/85 via-pink-500/85 to-rose-600/90" />'

$content = $content -replace '<section className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">', '<section className="relative bg-rose-900 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" style={{ backgroundImage: "url(''https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800'')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/90 via-pink-500/90 to-rose-600/90" />
        <div className="relative z-10 flex items-center gap-4 w-full sm:w-auto">'
        
$content = $content -replace '<div className="flex items-center gap-4">', '<div className="relative z-10 flex items-center gap-4">'

Set-Content -Path src\postpartum\pages\PostpartumDashboard.tsx -Value $content
