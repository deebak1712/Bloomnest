$content = Get-Content -Raw src\pages\MotherRecoveryPage.tsx
$newBtns = @'
        {onNavigateSubPage && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigateSubPage("breastfeeding")}
              className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-xs font-extrabold text-white hover:bg-white/30 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Milk className="w-3.5 h-3.5 text-white" />
              <span>Breastfeeding (Feat 08)</span>
            </button>
            <button
              onClick={() => onNavigateSubPage("pumping")}
              className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-xs font-extrabold text-white hover:bg-white/30 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Droplets className="w-3.5 h-3.5 text-white" />
              <span>Pumping (Feat 09)</span>
            </button>
            <button
              onClick={() => onNavigateSubPage("wound")}
              className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-xs font-extrabold text-white hover:bg-white/30 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Bandage className="w-3.5 h-3.5 text-white" />
              <span>Wound Care (Feat 07)</span>
            </button>
            <button
              onClick={() => onNavigateSubPage("sleep-fatigue")}
              className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-xs font-extrabold text-white hover:bg-white/30 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Moon className="w-3.5 h-3.5 text-white" />
              <span>Sleep & Fatigue (Feat 12)</span>
            </button>
            <button
              onClick={() => onNavigateSubPage("mood-wellbeing")}
              className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-xs font-extrabold text-white hover:bg-white/30 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Smile className="w-3.5 h-3.5 text-white" />
              <span>Mood (Feat 14)</span>
            </button>
          </div>
        )}
        </div>
      </header>
'@

$oldStart = '        {onNavigateSubPage && ('
$oldRegex = '(?s)        \{onNavigateSubPage && \(\s*<div.*?</header>\s*</header>'
$content = $content -replace $oldRegex, $newBtns

Set-Content -Path src\pages\MotherRecoveryPage.tsx -Value $content
