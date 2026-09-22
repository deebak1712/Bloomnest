import React, { useState } from "react";
import { UserProfile } from "../../types";
import { X, Printer, Copy, Check, FileCheck, Plane, Stethoscope, Building2, Calendar, ShieldCheck } from "lucide-react";

interface FitToFlyCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  airlineName?: string;
  destinationCity?: string;
}

export const FitToFlyCertificateModal: React.FC<FitToFlyCertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  airlineName = "IndiGo Airlines",
  destinationCity = "Bengaluru",
}) => {
  const [doctorName, setDoctorName] = useState(user.doctorName || "Dr. Ananya Sharma, MD, DGO (OB-GYN)");
  const [doctorRegNo, setDoctorRegNo] = useState("KMC / MCI Reg. No: 48921");
  const [hospitalName, setHospitalName] = useState(user.hospitalName || "Cloudnine Maternity Super-Specialty Hospital");
  const [hospitalCity, setHospitalCity] = useState("Bengaluru, India");
  const [originCity, setOriginCity] = useState("Bengaluru (BLR)");
  const [destCity, setDestCity] = useState(destinationCity ? `${destinationCity}` : "Chennai (MAA)");
  const [travelDate, setTravelDate] = useState("2026-10-15");
  const [pregnancyType, setPregnancyType] = useState<"Singleton" | "Twins">("Singleton");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const certificateText = `
OBSTETRIC MEDICAL CERTIFICATE OF FITNESS TO FLY (ACOG / IATA STANDARD)
Date of Issue: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

TO WHOM IT MAY CONCERN / AIRLINE MEDICAL CLEARANCE DESK:

This is to certify that I have clinically examined:
Patient Name: ${user.fullName}
Age: ${user.age || 28} Years
Current Gestational Age: Week ${user.currentWeek}
Expected Date of Delivery (EDD): ${user.edd || "N/A"}
Type of Pregnancy: ${pregnancyType} Pregnancy

CLINICAL DECLARATION:
1. The patient has an uncomplicated antenatal course to date.
2. There are no clinical symptoms, uterine contractions, or signs of preterm labor.
3. There is no active vaginal bleeding, placenta previa, or preeclampsia.
4. Cervical length and fetal growth parameters are within normal physiological limits.

In my professional clinical opinion, ${user.fullName} is clinically fit to travel via commercial passenger aircraft on the following route:
Origin: ${originCity}  ──>  Destination: ${destCity}
Scheduled Flight Date: ${travelDate}

Treating Obstetrician: ${doctorName}
Registration Number: ${doctorRegNo}
Hospital / Facility: ${hospitalName}, ${hospitalCity}
Doctor Contact: +91 98765 43210
Official Stamp / Signature: _______________________
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#120d18] w-full max-w-3xl rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/40 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-sky-100">
                Official Clinical Clearance Document
              </div>
              <div className="font-serif font-black text-sm text-white">
                ACOG / IATA OBSTETRIC FIT-TO-FLY CERTIFICATE
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Quick Info & Editable Controls Strip */}
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-sky-900 dark:text-sky-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Certificate Customization & Doctor Credentials</span>
              </span>
              <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">
                Airlines require issue within 48h to 7 days of departure
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Treating Obstetrician</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-sky-200 dark:border-sky-900/40 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">MCI / State Medical Reg No.</label>
                <input
                  type="text"
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-sky-200 dark:border-sky-900/40 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Hospital / Clinic Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-sky-200 dark:border-sky-900/40 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Flight Origin City / Airport</label>
                <input
                  type="text"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-sky-200 dark:border-sky-900/40 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Destination City / Airport</label>
                <input
                  type="text"
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-sky-200 dark:border-sky-900/40 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-1">Flight Departure Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-sky-200 dark:border-sky-900/40 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Formatted Certificate Sheet (Printable A4 Preview) */}
          <div className="bg-white text-black p-8 rounded-2xl border-2 border-gray-300 shadow-inner space-y-6 font-serif">
            {/* Certificate Letterhead */}
            <div className="border-b-2 border-black pb-4 text-center space-y-1">
              <div className="text-xs uppercase tracking-widest font-sans font-bold text-gray-600">
                Department of Obstetrics & Gynecology
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900">
                {hospitalName}
              </h2>
              <p className="text-[11px] font-sans text-gray-600">{hospitalCity} · Ph: +91 98765 43210</p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-black text-white text-[11px] uppercase tracking-widest font-sans font-black rounded">
                  Obstetric Medical Certificate of Fitness to Fly
                </span>
              </div>
            </div>

            {/* Date & Addressee */}
            <div className="flex items-center justify-between text-xs font-sans text-gray-700">
              <div>
                <strong>Date:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <div>
                <strong>To:</strong> Airport Check-in & Airline Medical Inspection Officer
              </div>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs font-sans leading-relaxed text-gray-800">
              <p>This is to certify that I have conducted an antenatal examination for:</p>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <p><strong>Patient Name:</strong> {user.fullName}</p>
                  <p><strong>Age:</strong> {user.age || 28} Years</p>
                  <p><strong>Blood Group:</strong> {user.bloodGroup || "O+ (Positive)"}</p>
                </div>
                <div>
                  <p><strong>Current Gestation:</strong> Week {user.currentWeek}</p>
                  <p><strong>Expected Delivery Date (EDD):</strong> {user.edd || "N/A"}</p>
                  <p><strong>Pregnancy Multiplicity:</strong> {pregnancyType} Pregnancy</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-gray-900">Clinical Evaluation:</h4>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-gray-700">
                  <li>The pregnancy is currently singleton/uncomplicated and progressing normally.</li>
                  <li>There is no history or clinical evidence of preterm labor, active uterine bleeding, cervical incompetence, or preeclampsia.</li>
                  <li>Ultrasound records demonstrate normal fetal biometry and healthy placental implantation.</li>
                  <li>Patient has been counseled on in-flight hydration and lower-limb circulation exercises to prevent deep vein thrombosis.</li>
                </ul>
              </div>

              <p className="pt-2 font-medium">
                In my professional clinical opinion, Mrs. {user.fullName} is medically fit to undertake commercial air travel from <strong>{originCity}</strong> to <strong>{destCity}</strong> scheduled on <strong>{travelDate}</strong>.
              </p>
            </div>

            {/* Doctor Signature Block */}
            <div className="pt-8 border-t border-gray-200 flex items-end justify-between font-sans text-xs">
              <div>
                <p className="text-[10px] text-gray-500 italic">Hospital Seal / Stamp</p>
                <div className="w-24 h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-[9px] text-gray-400 mt-1">
                  [ Official Seal ]
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="w-48 border-b border-black pb-1 mb-1" />
                <div className="font-bold text-gray-900">{doctorName}</div>
                <div className="text-[11px] text-gray-600">{doctorRegNo}</div>
                <div className="text-[11px] text-gray-500">{hospitalName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-[#161020] px-5 py-3.5 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#20182c] border border-gray-200 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Letter"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Certificate</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 dark:bg-rose-900 text-white font-bold rounded-xl text-xs hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
