import React from "react";
import { Appointment, PageView } from "../../types";
import { Calendar, ChevronRight } from "lucide-react";
import sarahAvatar from "../../assets/images/sarah_pastel_avatar_1785746217665.jpg";

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
  const doctorName = appointment?.doctorName || "Dr. Evelyn Reed";
  const appointmentDate = appointment?.appointmentDate || "Aug 18th";
  const time = appointment?.time || "10:00 AM";

  return (
    <div
      onClick={() => onNavigate("medical-timeline")}
      className="pastel-peach-card rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer group space-y-3"
    >
      <div className="flex items-center justify-between border-b border-orange-200/60 dark:border-orange-900/30 pb-2.5">
        <span className="font-serif font-bold text-base text-orange-950 dark:text-orange-100 flex items-center gap-1.5">
          <span>Appointments</span>
          <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200">
            Upcoming
          </span>
        </span>
        <Calendar className="w-4 h-4 text-orange-500" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={sarahAvatar}
            alt={doctorName}
            className="w-10 h-10 rounded-full object-cover border-2 border-rose-100 shadow-2xs"
          />
          <div>
            <div className="font-bold text-xs text-gray-900 dark:text-rose-100">
              {doctorName}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-rose-300">
              OB-GYN · Maternal Care
            </div>
            <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-300 mt-0.5">
              {appointmentDate} • {time}
            </div>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
