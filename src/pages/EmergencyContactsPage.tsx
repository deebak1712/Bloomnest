import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { EmergencyContact } from "../types";
import { 
  NATIONAL_MATERNAL_HELPLINES, 
  LABOR_DEPARTURE_DRILL, 
  buildEmergencySosMessage, 
  generateWhatsAppSosUrl, 
  generateSmsSosUrl 
} from "../data/emergencyDispatchData";
import { 
  PhoneCall, Plus, Hospital, User, Shield, AlertCircle, 
  Trash2, Edit3, MessageCircle, MapPin, Check, Copy, 
  Send, AlertOctagon, Heart, Stethoscope, Ambulance, 
  Share2, Compass, ShieldCheck, X, CheckSquare, Square
} from "lucide-react";

type ContactCategoryFilter = "all" | "partner" | "doctor" | "hospital" | "ambulance" | "family";

export const EmergencyContactsPage: React.FC = () => {
  const { 
    emergencyContacts, 
    addEmergencyContact, 
    deleteEmergencyContact, 
    updateEmergencyContact, 
    setPrimaryEmergencyContact,
    user, 
    showToast, 
    setActivePage,
    t 
  } = useApp();
  const currentWeek = Math.max(1, Math.min(40, user?.currentWeek || 24));
  const fetalImage = `/assets/cinematic/fetus_week_${currentWeek}.jpg`;

  const [selectedCategory, setSelectedCategory] = useState<ContactCategoryFilter>("all");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Partner");
  const [category, setCategory] = useState<EmergencyContact["category"]>("partner");
  const [phone, setPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [canMakeMedicalDecisions, setCanMakeMedicalDecisions] = useState(false);

  // SOS Broadcast Drawer states
  const [isSosBroadcastOpen, setIsSosBroadcastOpen] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [sosCustomNote, setSosCustomNote] = useState("Sudden onset of labor contractions. Heading to delivery hospital.");
  const [copiedSos, setCopiedSos] = useState(false);

  // Labor Drill checked items
  const [checkedDrillIds, setCheckedDrillIds] = useState<Record<string, boolean>>({});

  // Fetch GPS location on broadcast drawer open
  useEffect(() => {
    if (isSosBroadcastOpen && !locationCoords) {
      if ("geolocation" in navigator) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocationCoords({
              lat: Number(pos.coords.latitude.toFixed(5)),
              lng: Number(pos.coords.longitude.toFixed(5)),
            });
            setIsLocating(false);
          },
          (err) => {
            console.warn("Geolocation permission or retrieval error:", err);
            setIsLocating(false);
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      }
    }
  }, [isSosBroadcastOpen, locationCoords]);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setName("");
    setRelation("Partner");
    setCategory("partner");
    setPhone("");
    setSecondaryPhone("");
    setAddress("");
    setNotes("");
    setIsPrimary(false);
    setCanMakeMedicalDecisions(false);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setRelation(contact.relation);
    setCategory(contact.category || inferCategory(contact.relation));
    setPhone(contact.phone);
    setSecondaryPhone(contact.secondaryPhone || "");
    setAddress(contact.address || "");
    setNotes(contact.notes || "");
    setIsPrimary(contact.isPrimary);
    setCanMakeMedicalDecisions(contact.canMakeMedicalDecisions || false);
    setIsAddEditModalOpen(true);
  };

  const inferCategory = (rel: string): EmergencyContact["category"] => {
    const lower = rel.toLowerCase();
    if (lower.includes("doctor") || lower.includes("ob-gyn") || lower.includes("dr")) return "doctor";
    if (lower.includes("hospital") || lower.includes("desk") || lower.includes("clinic")) return "hospital";
    if (lower.includes("ambulance") || lower.includes("108") || lower.includes("102")) return "ambulance";
    if (lower.includes("partner") || lower.includes("husband") || lower.includes("spouse")) return "partner";
    return "family";
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingContact) {
      updateEmergencyContact(editingContact.id, {
        name: name.trim(),
        relation: relation.trim(),
        category,
        phone: phone.trim(),
        secondaryPhone: secondaryPhone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        isPrimary,
        canMakeMedicalDecisions,
      });
      showToast("Emergency contact updated! 📞");
    } else {
      addEmergencyContact({
        name: name.trim(),
        relation: relation.trim(),
        category,
        phone: phone.trim(),
        secondaryPhone: secondaryPhone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        isPrimary,
        canMakeMedicalDecisions,
      });
    }

    setIsAddEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this emergency contact?")) {
      deleteEmergencyContact(id);
    }
  };

  const toggleDrill = (id: string) => {
    setCheckedDrillIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered contacts list
  const filteredContacts = emergencyContacts.filter((c) => {
    if (selectedCategory === "all") return true;
    const cat = c.category || inferCategory(c.relation);
    return cat === selectedCategory;
  });

  const primaryPartner = emergencyContacts.find(
    (c) => (c.category === "partner" || c.relation.toLowerCase().includes("partner") || c.relation.toLowerCase().includes("husband")) && c.isPrimary
  ) || emergencyContacts.find((c) => c.relation.toLowerCase().includes("partner"));

  const primaryDoctor = emergencyContacts.find(
    (c) => (c.category === "doctor" || c.relation.toLowerCase().includes("doctor") || c.relation.toLowerCase().includes("ob-gyn")) && c.isPrimary
  ) || emergencyContacts.find((c) => c.relation.toLowerCase().includes("doctor"));

  const sosMessage = buildEmergencySosMessage(user, locationCoords, sosCustomNote);

  const handleCopySos = () => {
    navigator.clipboard.writeText(sosMessage);
    setCopiedSos(true);
    showToast("SOS message copied to clipboard! 📋");
    setTimeout(() => setCopiedSos(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Screen Header with Pastel Blush & 3D Fetal Studio Preview ────────────────── */}
      <div className="pastel-blush-card p-6 md:p-8 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-rose-200/50 shadow-sm relative overflow-hidden">
        <div className="flex items-start md:items-center gap-4 z-10">
          <div 
            onClick={() => setActivePage("baby-development")}
            className="relative group cursor-pointer shrink-0 rounded-2xl overflow-hidden border-2 border-rose-300/60 shadow-md hover:scale-105 transition-all duration-300 w-16 h-16 md:w-20 md:h-20 bg-rose-900/10"
            title="Click to view 3D Fetal Studio"
          >
            <img 
              src={fetalImage} 
              alt={`Week ${currentWeek} Baby Preview`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/cinematic/fetus_week_24.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-1">
              <span className="text-[9px] font-bold text-white bg-rose-600/80 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                W{currentWeek} 3D
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Emergency Preparedness & Triage</span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-rose-100 mt-1">
              Emergency Contacts & SOS Dispatch Hub
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-rose-200 mt-1 max-w-xl">
              Week {currentWeek} · 1-tap live GPS emergency broadcast, categorized medical responders, and national maternal helplines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={() => setIsSosBroadcastOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-red-500/25 active:scale-95 transition-all"
          >
            <AlertOctagon className="w-4 h-4 animate-bounce" />
            <span>1-Tap SOS Broadcast</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* ── National Maternal Helplines Quick-Access Strip in Pastel Sky Card ────────────────── */}
      <div className="pastel-sky-card p-5 rounded-3xl border border-sky-200/50 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-rose-100">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>National 24/7 Maternal & Emergency Helplines (India)</span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold uppercase">Toll-Free Instant Connect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {NATIONAL_MATERNAL_HELPLINES.map((helpline) => (
            <a
              key={helpline.number}
              href={`tel:${helpline.number}`}
              className={`p-3 rounded-2xl flex flex-col justify-between transition-all shadow-xs group ${helpline.colorClass}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/20 text-white/90">
                    {helpline.badge}
                  </span>
                  <PhoneCall className="w-3.5 h-3.5 opacity-80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="font-black text-lg mt-1 tracking-tight">{helpline.number}</div>
              </div>
              <div className="text-[10px] font-medium opacity-90 line-clamp-1 mt-1">
                {helpline.name}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Contact Category Filter Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-rose-100 dark:border-rose-900/30">
        {[
          { id: "all", label: `All (${emergencyContacts.length})`, icon: User },
          { id: "partner", label: "👨‍👩‍👧 Birth Partner", icon: Heart },
          { id: "doctor", label: "👩‍⚕️ OB-GYN & Doctors", icon: Stethoscope },
          { id: "hospital", label: "🏥 Hospital & Labor Room", icon: Hospital },
          { id: "ambulance", label: "🚑 Ambulance & Transit", icon: Ambulance },
          { id: "family", label: "🤝 Family & Backup", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === tab.id
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "bg-white dark:bg-[#1a1424] text-gray-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Contact Cards Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => {
          const cat = contact.category || inferCategory(contact.relation);
          return (
            <div
              key={contact.id}
              className={`p-5 rounded-3xl bg-white dark:bg-[#1a1424] border shadow-sm flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                contact.isPrimary
                  ? "border-rose-400 dark:border-rose-700/80 bg-gradient-to-b from-rose-50/30 to-white dark:from-rose-950/20 dark:to-[#1a1424]"
                  : "border-rose-100 dark:border-rose-900/40"
              }`}
            >
              <div className="space-y-3">
                {/* Header: Name, Category badge, Primary pill */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-black text-base text-gray-900 dark:text-rose-100 leading-tight">
                        {contact.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200">
                        {contact.relation}
                      </span>

                      {contact.isPrimary && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Primary ICE
                        </span>
                      )}

                      {contact.canMakeMedicalDecisions && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                          Decision Maker
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(contact)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Edit contact"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Numbers & Location */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold text-rose-600 dark:text-rose-300 text-sm">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{contact.phone}</span>
                  </div>

                  {contact.secondaryPhone && (
                    <div className="flex items-center gap-2 font-mono text-[11px] text-gray-500 dark:text-rose-400">
                      <span className="text-[9px] uppercase font-bold text-gray-400">Alt:</span>
                      <span>{contact.secondaryPhone}</span>
                    </div>
                  )}

                  {contact.address && (
                    <div className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-rose-400 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline hover:text-rose-600 line-clamp-2"
                        title="Open in Google Maps"
                      >
                        {contact.address}
                      </a>
                    </div>
                  )}

                  {contact.notes && (
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#20182c] text-[11px] text-gray-600 dark:text-rose-300 italic border border-gray-100 dark:border-rose-900/20">
                      "{contact.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Communication Triggers */}
              <div className="pt-2 border-t border-rose-50 dark:border-rose-900/30 flex items-center gap-2">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>

                <a
                  href={generateWhatsAppSosUrl(contact.phone, `Hi ${contact.name}, this is Sarah Jenkins (BloomNest Pregnancy Emergency).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                  title="Send WhatsApp message"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {!contact.isPrimary && (
                  <button
                    onClick={() => setPrimaryEmergencyContact(contact.id)}
                    className="py-2.5 px-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-rose-100 dark:hover:bg-rose-900 text-gray-600 dark:text-rose-300 font-bold text-[11px] transition-colors"
                    title="Make this the Primary ICE contact"
                  >
                    Set Primary
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="p-8 text-center bg-white dark:bg-[#1a1424] rounded-3xl border border-rose-100 dark:border-rose-900/40 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <div className="text-sm font-bold text-gray-800 dark:text-rose-200">
            No contacts found in this category
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold"
          >
            Add a Contact Now
          </button>
        </div>
      )}

      {/* ── Labor Departure Drill Checklist for Partners ──────────────────── */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-purple-950/20 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-black text-rose-600 dark:text-rose-400 tracking-wider">
              Emergency Rehearsal & Readiness
            </div>
            <h3 className="font-serif font-black text-base text-gray-900 dark:text-rose-100 mt-0.5">
              Labor Emergency Departure Drill Checklist
            </h3>
          </div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-300">
            {Object.values(checkedDrillIds).filter(Boolean).length} / {LABOR_DEPARTURE_DRILL.length} Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {LABOR_DEPARTURE_DRILL.map((item) => {
            const isChecked = !!checkedDrillIds[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleDrill(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  isChecked
                    ? "bg-white dark:bg-[#1a1424] border-emerald-500 shadow-2xs"
                    : "bg-white/80 dark:bg-[#1a1424]/80 border-rose-100 dark:border-rose-900/30 hover:border-rose-300"
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className={`font-bold text-xs block ${isChecked ? "text-emerald-700 dark:text-emerald-300 line-through" : "text-gray-900 dark:text-rose-100"}`}>
                    {item.label}
                  </span>
                  <p className="text-[11px] text-gray-500 dark:text-rose-400 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 1-TAP SOS BROADCAST MODAL ────────────────────────────────────── */}
      {isSosBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#120d18] w-full max-w-xl rounded-3xl shadow-2xl border-2 border-red-500/40 overflow-hidden my-auto flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
                <div>
                  <div className="text-[10px] uppercase font-black tracking-widest text-red-100">
                    Emergency Broadcast Dispatch
                  </div>
                  <div className="font-serif font-black text-sm">
                    MATERNAL LIVE GPS SOS BROADCAST
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSosBroadcastOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 text-xs">
              {/* GPS Location Status Pill */}
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${isLocating ? "text-amber-500 animate-spin" : "text-rose-600"}`} />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-rose-100">
                      {isLocating ? "Acquiring High-Accuracy GPS Coordinates..." : locationCoords ? "GPS Coordinates Locked" : "GPS Permission Not Granted"}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-rose-400">
                      {locationCoords ? `Lat: ${locationCoords.lat}, Lng: ${locationCoords.lng}` : "Using hospital landmark fallback"}
                    </div>
                  </div>
                </div>

                {locationCoords && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                    Live Pin Ready
                  </span>
                )}
              </div>

              {/* Quick Status Pill Options */}
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1.5 text-[11px]">
                  Select Emergency Context / Situation:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Water broke / Amniotic fluid leaking",
                    "Intense labor contractions (3-4 mins apart)",
                    "Vaginal bleeding / severe pain",
                    "On the way to delivery hospital now",
                    "Feeling dizzy / syncope / sudden fall",
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => setSosCustomNote(phrase)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold border transition-all ${
                        sosCustomNote === phrase
                          ? "bg-red-500 text-white border-red-500 shadow-2xs"
                          : "bg-white dark:bg-[#1a1424] text-gray-700 dark:text-rose-200 border-gray-200 dark:border-rose-900/30 hover:bg-rose-50"
                      }`}
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Preview Box */}
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1 text-[11px]">
                  Formatted SOS Message Preview:
                </label>
                <pre className="p-3.5 rounded-2xl bg-gray-900 text-rose-100 font-mono text-[11px] whitespace-pre-wrap leading-relaxed border border-gray-800 max-h-48 overflow-y-auto">
                  {sosMessage}
                </pre>
              </div>

              {/* Dispatch Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {primaryPartner && (
                    <a
                      href={generateWhatsAppSosUrl(primaryPartner.phone, sosMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Partner ({primaryPartner.name})</span>
                    </a>
                  )}

                  {primaryDoctor && (
                    <a
                      href={generateWhatsAppSosUrl(primaryDoctor.phone, sosMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>WhatsApp OB-GYN ({primaryDoctor.name})</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={generateSmsSosUrl(primaryPartner?.phone || "", sosMessage)}
                    className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send SMS Broadcast</span>
                  </a>

                  <button
                    onClick={handleCopySos}
                    className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-rose-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    {copiedSos ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSos ? "Copied!" : "Copy Full SOS Text"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT CONTACT MODAL ─────────────────────────────────────── */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#120d18] w-full max-w-lg rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-900/40 overflow-hidden my-auto flex flex-col">
            <div className="p-5 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
              <h3 className="font-serif font-black text-base text-gray-900 dark:text-rose-100 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-500" />
                <span>{editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}</span>
              </h3>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/50 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sharma / Rohan Jenkins"
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                  >
                    <option value="partner">👨‍👩‍👧 Birth Partner / Husband</option>
                    <option value="doctor">👩‍⚕️ OB-GYN / Doctor</option>
                    <option value="hospital">🏥 Hospital / Labor Room Desk</option>
                    <option value="ambulance">🚑 Ambulance / Transit Service</option>
                    <option value="family">🤝 Family / Doula / Backup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Relation / Title</label>
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="e.g. Primary OB-GYN / Husband / Labor Room Triage"
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Primary Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Secondary / Landline</label>
                  <input
                    type="tel"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    placeholder="+91 80 4321 8800"
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Hospital / Home Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address for GPS navigation"
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Emergency Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Has keys to house; direct line to labor casualty ward"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40"
                />
              </div>

              <div className="pt-2 border-t border-rose-100 dark:border-rose-900/30 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-bold text-gray-800 dark:text-rose-200">
                    Designate as Primary Emergency ICE Contact
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canMakeMedicalDecisions}
                    onChange={(e) => setCanMakeMedicalDecisions(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-semibold text-purple-900 dark:text-purple-300">
                    Authorized to make emergency medical decisions if patient is incapacitated
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-md"
                >
                  {editingContact ? "Save Changes" : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
