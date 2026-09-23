import re

with open('src/pages/BabyCarePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '{/* 👶 BABY PROFILE CARD */}'
end_marker = '{/* 🚀 QUICK ACCESS SHORTCUTS */}'

new_block = '''{/* 👶 BABY PROFILE CARD */}
      <section className="relative w-full rounded-[2rem] overflow-hidden shadow-xl shadow-purple-900/10 mb-8 border border-white/40">
        {/* Background gradient & Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400" />
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-6 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-full">
           <img 
              src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3" 
              alt="Sleeping baby" 
              className="w-full h-full object-cover object-center opacity-60 mix-blend-luminosity [mask-image:linear-gradient(to_right,transparent,black_40%)]"
            />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="flex-1 space-y-8 max-w-xl">
            {/* Top Label */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-sm">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-purple-100 block">Baby Profile Card</span>
                {babyData?.gender && babyData.gender !== "Unspecified" && (
                  <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                    {babyData.gender === "Girl" ? "🎀 Baby Girl" : babyData.gender === "Boy" ? "🧸 Baby Boy" : "✨ Surprise"}
                  </span>
                )}
              </div>
            </div>

            {/* Main Name & Age Grid */}
            <div className="space-y-1.5">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {babyData?.babyName || "Newborn Baby"}
              </h2>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                  <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
                  <span className="text-sm font-extrabold text-white">{formattedTime.formatted}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-purple-50">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Week {babyAgeWeeks} of growth</span>
                </div>
              </div>
            </div>

            {/* Reused Feature 01 Context Bar */}
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-inner">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Birth Date</span>
                </div>
                <span className="font-extrabold text-white text-sm block">{birthDateStr}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Baby className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </div>
                <span className="font-extrabold text-white text-sm block truncate">{formatDeliveryType(profile.deliveryType)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Weight className="w-3.5 h-3.5" />
                  <span>Weight</span>
                </div>
                <span className="font-extrabold text-white text-sm block">{babyData?.birthWeightKg ? `${babyData.birthWeightKg} kg` : "—"}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Length</span>
                </div>
                <span className="font-extrabold text-white text-sm block">{babyData?.birthLengthCm ? `${babyData.birthLengthCm} cm` : "—"}</span>
              </div>
            </div>
            
            {babyData?.notes && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-sm italic text-purple-50 border-l-4 border-l-pink-300">
                "{babyData.notes}"
              </div>
            )}
          </div>
          
          {/* Right Side Summary Cards */}
          <div className="flex-1 max-w-md w-full space-y-3 lg:pl-12">
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => onNavigateSubPage && onNavigateSubPage("baby-feeding")}
                className="bg-white rounded-3xl p-4 cursor-pointer hover:shadow-lg transition-shadow border border-white/40 flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0">
                  <Milk className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Feeding</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">{feedingStatus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-colors" />
              </div>
              
              <div 
                onClick={() => onNavigateSubPage && onNavigateSubPage("baby-sleep")}
                className="bg-white rounded-3xl p-4 cursor-pointer hover:shadow-lg transition-shadow border border-white/40 flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Sleep</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">{sleepStatus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>

              <div 
                onClick={() => onNavigateSubPage && onNavigateSubPage("diapers")}
                className="bg-white rounded-3xl p-4 cursor-pointer hover:shadow-lg transition-shadow border border-white/40 flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Baby className="w-5 h-5 text-teal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Diapers</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">{diaperStatus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
              </div>

              <div className="bg-white rounded-3xl p-4 border border-white/40 flex items-center gap-3 shadow-md">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Ruler className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Growth</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">On track</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>

            {/* AI Diaper Vision Card */}
            <div className="bg-gradient-to-r from-[#E9F0FF] to-[#F1EEFF] rounded-3xl p-4 border border-white/40 flex items-center gap-4 shadow-md relative overflow-hidden mt-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                <Baby className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-sm font-extrabold text-slate-800">AI Diaper Vision</h3>
                <p className="text-[10px] font-medium text-slate-600 leading-snug pr-4 mt-0.5">
                  Check your baby's diaper for visible characteristics & insights.
                </p>
              </div>
              <button 
                onClick={() => onNavigateSubPage && onNavigateSubPage("diapers")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-sm transition-colors shrink-0"
              >
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      </section>

      '''

parts = content.split(start_marker)
if len(parts) > 1:
    before = parts[0]
    after = parts[1].split(end_marker)[1]
    
    new_content = before + new_block + end_marker + after
    
    new_content = re.sub(r'(?s)// HELPER SUMMARY CARD.*?const CareSummaryCard.*?</div>\s*\);\s*};\s*', '', new_content)
    
    with open('src/pages/BabyCarePage.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced the profile card block.")
else:
    print("Could not find start marker")
