$content = Get-Content -Raw src\postpartum\pages\PostpartumDashboard.tsx

# 1. Replace Hero Header
$heroOld = '<section className="relative bg-rose-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-rose-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: "url(''https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200'')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/85 via-pink-500/85 to-rose-600/90" />
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                Fourth Trimester Hub
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-900 text-xs font-extrabold">
                {stage.title}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome to Postpartum Recovery, {user.fullName || user.name || "Mama"}! ??
            </h1>

            <p className="text-sm sm:text-base text-rose-100 max-w-2xl font-normal leading-relaxed">
              You are currently on <strong className="text-white font-bold">Postpartum Day {postpartumDay}</strong> ({timeFormatted.formatted}). Focus on physical rest, lactation support, and gentle recovery.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col items-center justify-center min-w-[200px] text-center space-y-1">
            <span className="text-xs font-medium text-rose-100 uppercase tracking-widest">Recovery Stage</span>
            <span className="text-3xl font-black text-white">Day {postpartumDay}</span>
            <span className="text-xs font-semibold text-rose-200">Week {postpartumWeek}</span>
          </div>
        </div>
      </section>'

$heroNew = '<section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src="https://ui-avatars.com/api/?name=Priya&background=fce7f3&color=be185d&rounded=true&size=64" alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-rose-100 shadow-sm" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Good morning, {user.fullName || user.name || "Priya"} <span className="text-xl">??</span>
            </h1>
            <p className="text-sm font-medium text-slate-500">
              You''re doing great! Today is <strong className="text-rose-600 font-bold">Postpartum Day {postpartumDay}</strong>.
            </p>
          </div>
        </div>
        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex flex-col items-center justify-center min-w-[160px] text-center space-y-0.5">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">{stage.title}</span>
          <span className="text-2xl font-black text-rose-900">Week {postpartumWeek}</span>
        </div>
      </section>'

$content = $content.Replace($heroOld, $heroNew)

Set-Content -Path src\postpartum\pages\PostpartumDashboard.tsx -Value $content
