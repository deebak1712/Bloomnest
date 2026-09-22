import React, { useEffect, useState } from "react";
import { MedicalProfileData, UserProfile } from "../../types";
import { generateEmergencyPayload, generateQrSvg } from "../../utils/emergencyQrGenerator";
import { 
  X, AlertOctagon, PhoneCall, Droplet, ShieldAlert, Heart, 
  Copy, Check, Printer, AlertTriangle, Stethoscope, Hospital, ShieldCheck 
} from "lucide-react";

interface EmergencyResponderModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MedicalProfileData;
  user: UserProfile;
}

export const EmergencyResponderModal: React.FC<EmergencyResponderModalProps> = ({
  isOpen,
  onClose,
  profile,
  user,
}) => {
  const [qrSvg, setQrSvg] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const payload = generateEmergencyPayload(profile, user);
    generateQrSvg(payload, 240).then((svg) => setQrSvg(svg));
  }, [isOpen, profile, user]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const payload = generateEmergencyPayload(profile, user);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isRhNegative = profile.rhFactor === "Negative";
  const hasPlacentaPrevia = profile.placentaLocation?.includes("Previa") || profile.placentaLocation?.includes("Low-Lying");
  const hasAnticoagulant = profile.criticalDailyMedications?.some((m) => m.isAnticoagulant);

  const gpalDisplay = profile.gpal 
    ? `G${profile.gpal.gravida} P${profile.gpal.para} A${profile.gpal.abortions} L${profile.gpal.living}`
    : `G${profile.gravidaCount} P${profile.paraCount}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#120d18] w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-red-500/40 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top High-Priority EMT Emergency Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-red-100">
                Paramedic & First Responder Pass
              </div>
              <div className="font-serif font-black text-sm tracking-tight text-white">
                OBSTETRIC EMERGENCY MEDICAL DATA
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Life-Saving Resuscitation Protocol Banners */}
          <div className="space-y-2.5">
            {/* ACOG Resuscitation Left Tilt Rule */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-950 dark:text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-black uppercase tracking-wider text-[11px] block text-amber-700 dark:text-amber-300">
                  ⚠️ ACOG / AHA Maternal Resuscitation Directive:
                </span>
                <p className="mt-0.5 leading-relaxed text-[11px] font-medium">
                  <strong>DO NOT LIE FLAT ON BACK!</strong> Maintain a <strong>15°–30° Left Lateral Tilt</strong> (or manual left uterine displacement - LUD) to avoid IVC aortocaval compression, which reduces maternal cardiac output by up to 40%.
                </p>
              </div>
            </div>

            {/* Rh Negative Alert */}
            {isRhNegative && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-950 dark:text-rose-200 flex items-start gap-3">
                <Droplet className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black uppercase tracking-wider text-[11px] block text-rose-700 dark:text-rose-300">
                    🩸 Rh-Negative Blood Alert (Sensitization Hazard):
                  </span>
                  <p className="mt-0.5 leading-relaxed text-[11px] font-medium">
                    Patient is <strong>Rh(D) Negative</strong>. In the event of any abdominal blunt trauma, road collision, or antepartum bleeding, administer <strong>Anti-D (RhoGAM 300 mcg) IM within 72 hours</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Placenta Previa Contraindication */}
            {hasPlacentaPrevia && (
              <div className="p-3.5 rounded-2xl bg-red-600/10 border-2 border-red-600/40 text-red-950 dark:text-red-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black uppercase tracking-wider text-[11px] block text-red-700 dark:text-red-300">
                    🚫 Placenta Previa / Low Placentation Contraindication:
                  </span>
                  <p className="mt-0.5 leading-relaxed text-[11px] font-medium">
                    <strong>STRICTLY CONTRAINDICATED: NO DIGITAL VAGINAL EXAM!</strong> Digital pelvic examination can trigger life-threatening torrential maternal-fetal hemorrhage. Immediate OB-GYN speculum/ultrasound only.
                  </p>
                </div>
              </div>
            )}

            {/* Anticoagulant Warning */}
            {hasAnticoagulant && (
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-950 dark:text-purple-200 flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-[11px] block text-purple-700 dark:text-purple-300">
                    💉 Active Anticoagulant / Antiplatelet Alert:
                  </span>
                  <p className="text-[11px]">
                    Patient is on active Aspirin/LMWH. Regional anesthesia (epidural/spinal) requires anesthesia hematology clearance.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Core Patient Metrics Grid & QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-[#1a1424] p-4 rounded-3xl border border-rose-100 dark:border-rose-900/30">
            {/* 2 Cols: Details */}
            <div className="sm:col-span-2 space-y-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Patient Name & Age</div>
                <div className="font-serif font-black text-lg text-gray-900 dark:text-rose-100 flex items-center gap-2">
                  <span>{user.fullName}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-full">
                    {user.age || 28} years
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#20182c] border border-rose-100 dark:border-rose-900/30">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Gestation & EDD</div>
                  <div className="font-extrabold text-rose-600 dark:text-rose-300">Week {user.currentWeek}</div>
                  <div className="text-[10px] text-gray-500 dark:text-rose-400">Due: {user.edd || "N/A"}</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#20182c] border border-rose-100 dark:border-rose-900/30">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Blood Group</div>
                  <div className="font-black text-base text-red-600 dark:text-red-400">
                    {profile.bloodGroup} ({profile.rhFactor})
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-rose-400">
                    {isRhNegative ? "Anti-D Sensitive" : "Compatible"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#20182c] border border-rose-100 dark:border-rose-900/30">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Obstetric Parity</div>
                  <div className="font-bold text-gray-800 dark:text-rose-200">{gpalDisplay}</div>
                  <div className="text-[10px] text-gray-500">
                    {profile.priorCesareanDetails?.hasPrior || profile.previousCSection ? "Prior C-Section Scar" : "No Prior Uterine Scar"}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#20182c] border border-rose-100 dark:border-rose-900/30">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Allergies</div>
                  <div className="font-bold text-red-600 dark:text-red-400 truncate">
                    {profile.allergies.length > 0 ? profile.allergies.join(", ") : "NKDA (None)"}
                  </div>
                  <div className="text-[10px] text-gray-500">Strictly Avoid</div>
                </div>
              </div>
            </div>

            {/* 1 Col: Big Scannable QR Code */}
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-white rounded-2xl border border-gray-200 shadow-inner">
              {qrSvg ? (
                <div
                  className="w-36 h-36 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="w-36 h-36 bg-gray-100 animate-pulse rounded-lg" />
              )}
              <div className="text-[10px] font-black uppercase text-slate-800 mt-1 tracking-wider text-center">
                Scan with Phone Camera
              </div>
              <div className="text-[9px] text-slate-500 text-center">
                Instant Offline Medical Summary
              </div>
            </div>
          </div>

          {/* Allergies & High Risk Badges */}
          <div className="space-y-3">
            <div>
              <div className="font-bold text-[11px] text-gray-700 dark:text-rose-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                <span>Confirmed Drug & Environmental Allergies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((alg, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 font-black text-xs flex items-center gap-1"
                  >
                    <span>🚫</span>
                    <span>{alg}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* High-Risk Clinical Conditions */}
            {profile.highRiskNotes && profile.highRiskNotes.length > 0 && (
              <div>
                <div className="font-bold text-[11px] text-gray-700 dark:text-rose-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Clinical Risk Factors & Protocols</span>
                </div>
                <div className="space-y-1.5">
                  {profile.highRiskNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 font-semibold"
                    >
                      • {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Daily Medications */}
            {profile.criticalDailyMedications && profile.criticalDailyMedications.length > 0 && (
              <div>
                <div className="font-bold text-[11px] text-gray-700 dark:text-rose-200 uppercase tracking-wider mb-1.5">
                  💊 Active Critical Medications
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.criticalDailyMedications.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#20182c] border border-rose-100 dark:border-rose-900/30"
                    >
                      <div className="font-bold text-gray-900 dark:text-rose-100 text-xs flex items-center justify-between">
                        <span>{m.name}</span>
                        {m.isAnticoagulant && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold uppercase">
                            Anticoagulant
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-rose-600 dark:text-rose-300 font-semibold">
                        {m.dose} · {m.frequency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 1-Tap Emergency Speed-Dials */}
          <div className="pt-2 border-t border-rose-100 dark:border-rose-900/30 space-y-2">
            <div className="font-bold text-[11px] text-gray-700 dark:text-rose-200 uppercase tracking-wider">
              📞 1-Tap Emergency Hospital & Doctor Contacts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={`tel:${profile.obgynPhone}`}
                className="p-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-between shadow-sm transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-90 uppercase">OB-GYN</div>
                    <div className="font-bold truncate max-w-[120px]">{profile.obgynName}</div>
                  </div>
                </div>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${profile.emergencyContactPhone}`}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-between shadow-sm transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-90 uppercase">Partner / ICE</div>
                    <div className="font-bold truncate max-w-[120px]">{profile.emergencyContactName}</div>
                  </div>
                </div>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>

              <a
                href="tel:108"
                className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-between shadow-sm transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <Hospital className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-90 uppercase">Maternal Ambulance</div>
                    <div className="font-bold">108 / 102</div>
                  </div>
                </div>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-gray-50 dark:bg-[#161020] px-5 py-3.5 border-t border-rose-100 dark:border-rose-900/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#20182c] border border-rose-200 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Emergency Text!" : "Copy Medical Text"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#20182c] border border-rose-200 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-rose-500" />
              <span>Print Handover Sheet</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 dark:bg-rose-900 text-white font-bold rounded-xl text-xs hover:opacity-90 transition-opacity"
          >
            Close Emergency View
          </button>
        </div>
      </div>
    </div>
  );
};
