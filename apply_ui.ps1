$content = Get-Content -Raw src\postpartum\pages\PostpartumDashboard.tsx

$newUI = @'
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - DASHBOARD OVERVIEW */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Recovery Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-sm font-extrabold text-slate-800">Today's Recovery</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path strokeDasharray="82, 100" className="text-indigo-500 drop-shadow-sm transition-all duration-1000" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-indigo-900">82%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500"/> Sleep</span>
                  <span className="text-indigo-600">6h 20m</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Pain</span>
                  <span className="text-emerald-600">Mild</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500"/> Bleeding</span>
                  <span className="text-blue-600">Improving</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500"/> Mood</span>
                  <span className="text-amber-600">Stable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Baby Today Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-sm font-extrabold text-slate-800">Baby Today</h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-slate-400">Feeding</span>
                  <span className="block text-xs font-extrabold text-slate-700">6 times</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-slate-400">Sleep</span>
                  <span className="block text-xs font-extrabold text-slate-700">13h 20m</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Baby className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-slate-400">Diapers</span>
                  <span className="block text-xs font-extrabold text-slate-700">5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Shield Minimal */}
          <div 
            onClick={() => onNavigateSubPage("safety")}
            className="bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer rounded-2xl p-4 border border-emerald-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-900">Safety Shield</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">No immediate concerns</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* RIGHT COLUMN - FEATURE ACTIONS GRID */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button onClick={() => onNavigateSubPage("checkin")} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <Smile className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase">AI Agent</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Voice Check-in</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Talk to BloomNest in Tanglish naturally.</p>
            </div>
          </button>

          <button onClick={() => onNavigateSubPage("diapers")} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase">AI Vision</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">AI Diaper Vision</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Scan diapers for instant safety analysis.</p>
            </div>
          </button>

          <button onClick={() => onNavigateSubPage("recovery")} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-rose-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
                <Activity className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Mother Recovery</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Track your physical and emotional health.</p>
            </div>
          </button>

          <button onClick={() => onNavigateSubPage("baby-care")} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Baby className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Baby Care & Growth</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Log feeding, sleep, and milestones.</p>
            </div>
          </button>

          <button onClick={() => onNavigateSubPage("doctor-brief")} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all text-left flex flex-col justify-between h-40 sm:col-span-2">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-1 rounded-full uppercase">AI Summary</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Doctor Brief Generator</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Turns your data into a concise clinical summary for visits.</p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
'@

# Replace everything after the first section (the hero section ends with </section>)
$parts = $content -split '(?<=</section>\s*)', 2
$content = $parts[0] + "
" + $newUI

Set-Content -Path src\postpartum\pages\PostpartumDashboard.tsx -Value $content
