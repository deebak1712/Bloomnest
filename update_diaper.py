import re

with open('src/pages/DiaperMonitoringPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '{/* TOP BANNER & FEATURE BADGE */}'
end_marker = '{/* MULTI-BABY SELECTOR (If multiple babies) */}'

new_block = '''{/* TOP BANNER & FEATURE BADGE */}
        <div className="relative w-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-400 rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-fuchsia-900/20 border border-white/20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Custom AI Generated 3D Diaper Background */}
          <div className="absolute inset-0 w-full h-full">
             {/* The image is placed on the right side, fading out to the left */}
             <div className="absolute top-0 right-0 w-full md:w-[70%] h-full [mask-image:linear-gradient(to_right,transparent,black_40%,black)]">
               <img 
                  src="/images/cute_3d_diaper.jpg" 
                  alt="Cute 3D Diaper" 
                  className="w-full h-full object-cover object-[center_70%] opacity-90"
                />
             </div>
             {/* Gradient overlay to ensure text is perfectly readable on the left */}
             <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-fuchsia-600/90 to-transparent w-full md:w-3/4" />
          </div>

          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-white/30 shadow-sm">
                <BabyIcon className="w-4 h-4" />
                Feature 11 • Diaper Care
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Baby Diaper Care
            </h1>
            
            <p className="text-sm sm:text-base font-medium text-white/90 leading-relaxed max-w-md">
              Track wet & dirty diapers, urine amount, stool color & consistency for <strong className="text-white font-extrabold">{babyNameDisplay}</strong> ({babyAgeText}).
            </p>

            <div className="flex items-center gap-3 pt-4">
              {onNavigateSubPage && (
                <button
                  onClick={() => onNavigateSubPage('safety')}
                  className="px-5 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  View Safety Shield
                </button>
              )}
              {onNavigateSubPage && (
                <button
                  onClick={() => onNavigateSubPage('baby_care')}
                  className="px-5 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <BabyIcon className="w-4 h-4 text-pink-200" />
                  Baby Care Dashboard
                </button>
              )}
            </div>
          </div>
        </div>

        '''

parts = content.split(start_marker)
if len(parts) > 1:
    before = parts[0]
    after = parts[1].split(end_marker)[1]
    
    new_content = before + new_block + end_marker + after
    with open('src/pages/DiaperMonitoringPage.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced the diaper banner block.")
else:
    print("Could not find start marker")
