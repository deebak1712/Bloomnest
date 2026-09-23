import React from "react";
import { Appointment, PageView } from "../../types";
import { Calendar, ChevronRight, Stethoscope, MapPin, Clock, FileCheck } from "lucide-react";

interface NextAppointmentCardProps {
  appointment?: Appointment;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const NextAppointmentCard: React.FC<NextAppointmentCardProps> = ({
  appointment,
  onNavigate,
  t,
}) => {
  const doctorName = appointment?.doctorName || "Dr. Ananya Sharma, MD";
  const appointmentDate = appointment?.appointmentDate || "Tomorrow";
  const time = appointment?.time || "10:30 AM";
  const hospital = appointment?.hospitalName || "Apollo Cradle Maternity Hospital";

  return (
    <div
      onClick={() => onNavigate("medical-timeline")}
      className="pink-cream-card rounded-3xl p-5 space-y-3.5 border border-[#f3dbe2] dark:border-rose-900/30 group cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
    >
      <div className="flex items-center justify-between border-b border-[#f3dbe2]/70 dark:border-rose-900/30 pb-2.5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#b84a6b] dark:text-rose-300 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          <span>Next Clinical Visit</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
          Tomorrow
        </span>
      </div>

      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 bg-[#fce8ee] dark:bg-rose-950/80 text-[#8f2d48] dark:text-rose-300 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
          <Stethoscope className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-[#681e35] dark:text-rose-100 leading-snug">
            {doctorName}
          </h4>
          <div className="text-[11px] text-gray-500 dark:text-rose-300/70 font-medium">
            Obstetrician & Maternal-Fetal Specialist
          </div>

          <div className="text-xs font-bold text-[#8f2d48] dark:text-rose-200 flex items-center gap-1.5 pt-0.5">
            <Clock className="w-3 h-3 text-rose-500" />
            <span>{appointmentDate} • {time}</span>
          </div>

          {hospital && (
            <div className="text-[11px] text-gray-500 dark:text-rose-300/70 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">{hospital}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: Consultation Prep */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onNavigate("reports");
        }}
        className="pt-1 flex items-center justify-between text-xs font-bold text-[#b84a6b] dark:text-rose-300 hover:text-rose-700"
      >
        <span className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Open 1-Page Ob-Gyn Handover Brief</span>
        </span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};
