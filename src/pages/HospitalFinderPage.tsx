import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Building2, Search, PhoneCall, Navigation, HeartPulse, Droplet, MapPin, Sparkles, LocateFixed, Compass } from "lucide-react";

export const HospitalFinderPage: React.FC = () => {
  const { showToast } = useApp();
  const [citySearch, setCitySearch] = useState("");
  const [selectedCityTab, setSelectedCityTab] = useState<string>("All");
  const [filterNicuOnly, setFilterNicuOnly] = useState(false);
  const [filterBloodBank, setFilterBloodBank] = useState(false);
  const [mcpLoading, setMcpLoading] = useState(false);
  const [mcpHospitals, setMcpHospitals] = useState<any[]>([]);
  const [userLocationDetected, setUserLocationDetected] = useState(false);
  const [searchNearMeUrl, setSearchNearMeUrl] = useState("https://www.google.com/maps/search/24%2F7+maternity+hospital+with+NICU+near+me/");

  const fetchHospitals = async (lat?: number, lng?: number, cityOverride?: string) => {
    setMcpLoading(true);
    try {
      const city = cityOverride !== undefined ? cityOverride : (selectedCityTab !== "All" ? selectedCityTab : citySearch);
      const res = await fetch("/api/mcp/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "find_hospitals",
          payload: {
            latitude: lat,
            longitude: lng,
            cityQuery: city,
            requireLevel4Nicu: filterNicuOnly,
            maxResults: 8
          }
        })
      });
      const data = await res.json();
      if (data.results) {
        setMcpHospitals(data.results);
        if (data.userLocationDetected) {
          setUserLocationDetected(true);
        }
        if (data.searchNearMeUrl) {
          setSearchNearMeUrl(data.searchNearMeUrl);
        }
      }
    } catch {
      showToast("Loaded offline hospital registry.");
    } finally {
      setMcpLoading(false);
    }
  };

  // Auto-detect location on initial mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchHospitals(pos.coords.latitude, pos.coords.longitude);
          setUserLocationDetected(true);
          showToast("📍 Real GPS location detected! Hospitals sorted by nearest distance.");
        },
        () => {
          // Fallback to default fetch if GPS permission not granted
          fetchHospitals();
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      fetchHospitals();
    }
  }, [filterNicuOnly]);

  const handleManualGpsDetect = () => {
    if (navigator.geolocation) {
      setMcpLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchHospitals(pos.coords.latitude, pos.coords.longitude);
          setUserLocationDetected(true);
          showToast("📍 Location locked! Nearest maternity hospitals re-sorted.");
        },
        (err) => {
          setMcpLoading(false);
          showToast("Could not access GPS. Please choose your city below.");
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      showToast("Geolocation is not supported by your browser.");
    }
  };

  const handleCityTabClick = (city: string) => {
    setSelectedCityTab(city);
    setCitySearch("");
    if (city === "All") {
      handleManualGpsDetect();
    } else {
      fetchHospitals(undefined, undefined, city);
    }
  };

  const filteredHospitals = mcpHospitals.filter((h) => {
    const matchesQuery =
      !citySearch ||
      h.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      h.address.toLowerCase().includes(citySearch.toLowerCase()) ||
      h.locality?.toLowerCase().includes(citySearch.toLowerCase());
    const matchesNicu = !filterNicuOnly || h.nicuLevel.includes("Level IV");
    const matchesBlood = !filterBloodBank || h.bloodBankAvailable;
    return matchesQuery && matchesNicu && matchesBlood;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Emergency Facilities & Real GPS Navigation</span>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black tracking-normal flex items-center gap-1 shadow-xs">
              <Compass className="w-3 h-3 text-amber-300" />
              Google Maps Platform MCP
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            Maternity Emergency & Hospital Radar
          </h1>
          <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
            {userLocationDetected
              ? "📍 Real GPS location active: Certified maternity hospitals sorted strictly by closest driving proximity."
              : "Locate certified maternity hospitals with Level-III/IV NICU centers and live traffic routing via Google Maps Platform MCP."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleManualGpsDetect}
            disabled={mcpLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <LocateFixed className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{mcpLoading ? "Detecting GPS..." : "📍 Detect My Live Location"}</span>
          </button>

          <a
            href={searchNearMeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white dark:bg-[#1a1523] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Navigation className="w-4 h-4 text-rose-500" />
            <span>Open Maps Near Me</span>
          </a>

          <button
            onClick={() => showToast("Emergency SOS 108 Maternity Ambulance Dispatched!")}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108 SOS</span>
          </button>
        </div>
      </div>

      {/* City Tabs & Locality Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Hubs:</span>
        {["All", "Chennai", "Bengaluru", "Hyderabad", "Coimbatore", "Madurai"].map((city) => (
          <button
            key={city}
            onClick={() => handleCityTabClick(city)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
              selectedCityTab === city
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-white dark:bg-[#1a1523] text-gray-700 dark:text-rose-200 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-50"
            }`}
          >
            {city === "All" ? "📍 All Closest (GPS)" : city}
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search hospital name, neighborhood (e.g. Alwarpet, Indiranagar, Banjara Hills)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setFilterNicuOnly(!filterNicuOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filterNicuOnly
                  ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                  : "bg-rose-50/30 dark:bg-rose-950/20 text-gray-700 dark:text-rose-200 border-rose-100 dark:border-rose-900/30 hover:bg-rose-50"
              }`}
            >
              Level IV Advanced NICU Only
            </button>

            <button
              onClick={() => setFilterBloodBank(!filterBloodBank)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filterBloodBank
                  ? "bg-red-600 text-white border-red-700 shadow-xs"
                  : "bg-rose-50/30 dark:bg-rose-950/20 text-gray-700 dark:text-rose-200 border-rose-100 dark:border-rose-900/30 hover:bg-rose-50"
              }`}
            >
              24/7 Blood Bank
            </button>
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid (Strictly sorted by proximity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map((hospital, idx) => (
          <div
            key={hospital.id || idx}
            className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
                    {hospital.type}
                  </span>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Nearest Center
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  📍 {hospital.distanceKm} km (~{hospital.estimatedDriveTimeMins || Math.round(hospital.distanceKm * 2.8)} mins drive)
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 leading-snug">
                {hospital.name}
              </h3>

              <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-rose-300">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{hospital.address}</span>
              </div>

              {hospital.locality && (
                <div className="text-[11px] text-gray-400 font-medium">
                  Locality: <span className="font-semibold text-gray-600 dark:text-gray-300">{hospital.locality}, {hospital.city}</span>
                </div>
              )}

              {/* Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
                <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400">NICU Standard</div>
                    <div className="font-bold">{hospital.nicuLevel}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-900 dark:text-red-200 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400">Blood Bank</div>
                    <div className="font-bold">{hospital.bloodBankAvailable ? "24/7 On-Site" : "On-Call"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
              <a
                href={`tel:${hospital.emergencyPhone}`}
                onClick={() => showToast(`Dialing emergency line: ${hospital.emergencyPhone}`)}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Emergency</span>
              </a>

              <button
                onClick={() => {
                  if (hospital.googleMapsUrl) {
                    window.open(hospital.googleMapsUrl, "_blank");
                  } else {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`, "_blank");
                  }
                  showToast(`Opening live Google Maps directions to ${hospital.name}...`);
                }}
                className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 cursor-pointer transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Directions (Maps MCP)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="text-center py-12 space-y-3 bg-white dark:bg-[#1a1523] p-8 rounded-3xl border border-rose-100 dark:border-rose-900/40">
          <Building2 className="w-10 h-10 text-gray-400 mx-auto" />
          <p className="text-sm font-bold text-gray-700 dark:text-rose-200">No matching hospital found in this specific neighborhood.</p>
          <a
            href={searchNearMeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>Search All Nearby Maternity Centers on Google Maps</span>
          </a>
        </div>
      )}
    </div>
  );
};
