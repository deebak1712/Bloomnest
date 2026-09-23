import React, { useState, useEffect, useMemo, useRef } from "react";
import { useApp } from "../context/AppContext";
import { MaternityHospitalResult } from "../services/googleMcpService";
import { 
  CITY_HUBS, 
  CityHubLocation,
  OFFLINE_VERIFIED_HOSPITALS, 
  processHospitalsDynamic,
  calculateHaversineDistance,
  estimateDriveTimeMins
} from "../data/hospitalFinderData";
import { 
  Building2, Search, PhoneCall, Navigation, HeartPulse, 
  Droplet, MapPin, Sparkles, LocateFixed, Compass, 
  Share2, Car, ShieldAlert, CheckCircle2, Clock, 
  Radio, RefreshCw, AlertCircle, ExternalLink, Activity
} from "lucide-react";

export const HospitalFinderPage: React.FC = () => {
  const { user, showToast, updateUserProfile, addEmergencyContact, emergencyContacts, setActivePage } = useApp();
  const currentWeek = Math.max(1, Math.min(40, user?.currentWeek || 24));
  const fetalImage = `/assets/cinematic/fetus_week_${currentWeek}.jpg`;

  // Coordinates & GPS State
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"detecting" | "locked" | "denied" | "manual">("detecting");
  const [isLiveTracking, setIsLiveTracking] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  // Filters & Search
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterNicuOnly, setFilterNicuOnly] = useState<boolean>(false);
  const [filterBloodBank, setFilterBloodBank] = useState<boolean>(false);

  // In-transit HUD state
  const [inTransitHospital, setInTransitHospital] = useState<MaternityHospitalResult | null>(null);

  // API MCP sync loading state
  const [mcpLoading, setMcpLoading] = useState<boolean>(false);
  const [apiHospitals, setApiHospitals] = useState<MaternityHospitalResult[] | null>(null);

  // Detect GPS on initial mount
  useEffect(() => {
    detectDeviceLocation(true);
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Primary GPS detection function
  const detectDeviceLocation = (isInitial = false) => {
    if (!navigator.geolocation) {
      setGpsStatus("denied");
      // Default to Chennai hub coordinates
      setUserCoords({ lat: 13.0418, lng: 80.2341 });
      if (!isInitial) showToast("Geolocation is not supported by your browser.");
      return;
    }

    setGpsStatus("detecting");
    setMcpLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsStatus("locked");
        setSelectedCity("All");
        setMcpLoading(false);
        showToast("📍 Live device GPS locked! Closest maternity hospitals sorted.");
        fetchMcpServerHospitals(coords.lat, coords.lng);
      },
      (err) => {
        console.warn("GPS access denied or timed out:", err.message);
        setGpsStatus("denied");
        setMcpLoading(false);
        // Default to Chennai hub coordinates for graceful offline proximity
        setUserCoords({ lat: 13.0418, lng: 80.2341 });
        if (!isInitial) showToast("GPS permission denied. Using selected city center.");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  // Toggle real-time in-transit location watching
  const toggleLiveTracking = () => {
    if (isLiveTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
      showToast("Live GPS tracking paused.");
    } else {
      if (!navigator.geolocation) {
        showToast("Geolocation not supported on this device.");
        return;
      }
      setIsLiveTracking(true);
      showToast("🚗 In-Transit Live GPS tracking activated!");
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsAccuracy(Math.round(pos.coords.accuracy));
          setGpsStatus("locked");
        },
        (err) => {
          console.warn("Live watch error:", err);
          setIsLiveTracking(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }
  };

  // Background MCP Server Fetch (fails gracefully)
  const fetchMcpServerHospitals = async (lat: number, lng: number, city?: string) => {
    try {
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
            maxResults: 10
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          setApiHospitals(data.results);
        }
      }
    } catch (e) {
      console.warn("MCP API offline or unavailable, running client Haversine engine seamlessly.");
    }
  };

  // Handle City Chip Click
  const handleSelectCityHub = (city: CityHubLocation | "All") => {
    if (city === "All") {
      setSelectedCity("All");
      detectDeviceLocation();
    } else {
      setSelectedCity(city.name);
      setUserCoords({ lat: city.lat, lng: city.lng });
      setGpsStatus("manual");
      setGpsAccuracy(null);
      showToast(`📍 Re-centered to ${city.name} (${city.tag})!`);
      fetchMcpServerHospitals(city.lat, city.lng, city.name);
    }
  };

  // Dynamic Hospitals List (Client-side Haversine engine guarantees 100% reliability)
  const displayedHospitals = useMemo(() => {
    const activeLat = userCoords?.lat || 13.0418;
    const activeLng = userCoords?.lng || 80.2341;

    return processHospitalsDynamic({
      userLat: activeLat,
      userLng: activeLng,
      searchQuery: searchQuery,
      requireLevel4Nicu: filterNicuOnly,
      requireBloodBank: filterBloodBank,
      maxResults: 12
    });
  }, [userCoords, searchQuery, filterNicuOnly, filterBloodBank]);

  // Google Maps Search Near Me URL
  const searchNearMeUrl = useMemo(() => {
    if (userCoords) {
      return `https://www.google.com/maps/search/24%2F7+maternity+hospital+with+NICU/@${userCoords.lat},${userCoords.lng},14z`;
    }
    return `https://www.google.com/maps/search/24%2F7+maternity+hospital+with+NICU+near+me/`;
  }, [userCoords]);

  // 1-Tap WhatsApp Emergency Dispatch
  const shareHospitalToWhatsApp = (h: MaternityHospitalResult) => {
    const text = `🚨 *BLOOMNEST EMERGENCY MATERNITY ADMISSION* 🚨\n\n` +
      `*Patient:* ${user?.name || "Priya"}\n` +
      `*Gestational Age:* Week ${user?.currentWeek || 24}\n` +
      `*Destination Hospital:* ${h.name}\n` +
      `*Address:* ${h.address}\n` +
      `*Casualty Hotline:* ${h.emergencyPhone}\n` +
      `*Distance / ETA:* ${h.distanceKm} km (~${h.estimatedDriveTimeMins} mins)\n` +
      `*NICU Standard:* ${h.nicuLevel}\n` +
      `*Live GPS Route:* ${h.googleMapsUrl}\n\n` +
      `Please alert the labor casualty desk immediately.`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* ── Screen Header with Pastel Blush & 3D Fetal Studio Preview ── */}
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
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider flex-wrap">
              <Building2 className="w-4 h-4" />
              <span>Emergency Facilities & Live GPS Radar</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black tracking-normal flex items-center gap-1 shadow-xs">
                <Compass className="w-3 h-3 text-amber-300" />
                Google Maps Platform MCP
              </span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-rose-100 mt-1">
              Maternity Emergency & Level IV NICU Radar
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-rose-200 mt-1 max-w-xl">
              Week {currentWeek} · Real-time device GPS geolocation · Dynamic Haversine proximity re-sorting · 24/7 Obstetric OT, Blood Bank, and Level IV Surgical NICU verification.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <button
            onClick={() => detectDeviceLocation()}
            disabled={mcpLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <LocateFixed className={`w-4 h-4 text-amber-300 ${mcpLoading ? "animate-spin" : "animate-pulse"}`} />
            <span>{mcpLoading ? "Detecting GPS..." : "📍 Locate Device"}</span>
          </button>

          <button
            onClick={toggleLiveTracking}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all border ${
              isLiveTracking 
                ? "bg-amber-500 text-white border-amber-600 animate-pulse" 
                : "bg-white/80 dark:bg-[#1a1523]/80 backdrop-blur-sm text-gray-700 dark:text-rose-200 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50"
            }`}
          >
            <Radio className="w-4 h-4 text-rose-500" />
            <span>{isLiveTracking ? "Live Tracking ON" : "In-Transit Mode"}</span>
          </button>

          <a
            href="tel:108"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108 SOS</span>
          </a>
        </div>
      </div>

      {/* ── Live GPS Status Strip with Pastel Sky Card ── */}
      <div className="pastel-sky-card p-4 rounded-3xl border border-sky-200/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
            gpsStatus === "locked" ? "bg-emerald-500 animate-ping" : gpsStatus === "detecting" ? "bg-amber-500 animate-pulse" : "bg-blue-500"
          }`} />
          <div className="text-xs">
            <span className="font-bold text-gray-900 dark:text-rose-100">
              {gpsStatus === "locked" 
                ? `📍 Device GPS Locked: ${userCoords?.lat.toFixed(4)}° N, ${userCoords?.lng.toFixed(4)}° E` 
                : gpsStatus === "detecting"
                ? "Acquiring high-accuracy satellite coordinates..."
                : `Center: ${selectedCity !== "All" ? selectedCity : "Default Metropolitan Hub"}`}
            </span>
            {gpsAccuracy && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
                (±{gpsAccuracy}m precision)
              </span>
            )}
            <p className="text-[11px] text-gray-500 dark:text-rose-300">
              Hospitals dynamically re-ordered strictly by closest driving distance from this location.
            </p>
          </div>
        </div>

        <a
          href={searchNearMeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Explore Surrounding Area on Google Maps ↗</span>
        </a>
      </div>

      {/* ── In-Transit Active HUD (When Heading to Casualty) ── */}
      {inTransitHospital && (
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 text-white p-5 rounded-3xl shadow-xl space-y-3 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-rose-200">
              <Car className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>In-Transit Active Navigation HUD · En Route to Casualty</span>
            </div>
            <button
              onClick={() => setInTransitHospital(null)}
              className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg bg-black/20"
            >
              ✕ Dismiss HUD
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold">{inTransitHospital.name}</h2>
              <p className="text-xs text-rose-100 mt-0.5">{inTransitHospital.address}</p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-rose-200">Distance</div>
                <div className="font-serif text-2xl font-extrabold">{inTransitHospital.distanceKm} km</div>
              </div>
              <div className="text-right border-l border-white/20 pl-4">
                <div className="text-[10px] uppercase font-bold text-rose-200">ETA Drive</div>
                <div className="font-serif text-2xl font-extrabold">~{inTransitHospital.estimatedDriveTimeMins} mins</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/20">
            <a
              href={inTransitHospital.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white text-gray-900 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-rose-50 transition-colors"
            >
              <Navigation className="w-4 h-4 text-rose-600" />
              <span>Turn-by-Turn Google Navigation</span>
            </a>

            <a
              href={`tel:${inTransitHospital.emergencyPhone.replace(/\s+/g, "")}`}
              className="px-4 py-2 rounded-xl bg-amber-400 text-gray-900 font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-300 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Casualty En Route ({inTransitHospital.emergencyPhone})</span>
            </a>

            <button
              onClick={() => shareHospitalToWhatsApp(inTransitHospital)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Send ETA to Family WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Regional Hub Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Hubs:</span>
        <button
          onClick={() => handleSelectCityHub("All")}
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
            selectedCity === "All"
              ? "bg-rose-500 text-white shadow-xs"
              : "bg-white dark:bg-[#1a1523] text-gray-700 dark:text-rose-200 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-50"
          }`}
        >
          📍 Auto GPS Proximity
        </button>

        {CITY_HUBS.map((hub) => (
          <button
            key={hub.id}
            onClick={() => handleSelectCityHub(hub)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
              selectedCity === hub.name
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-white dark:bg-[#1a1523] text-gray-700 dark:text-rose-200 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-50"
            }`}
          >
            {hub.name}
          </button>
        ))}
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital name, area (e.g. Alwarpet, Indiranagar, Ramnagar) or 6-digit Pincode..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold focus:outline-hidden text-gray-900 dark:text-rose-100"
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

      {/* ── Hospital Cards Grid (Dynamic Proximity Sorting) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedHospitals.map((hospital, idx) => (
          <div
            key={hospital.id || idx}
            className={`p-6 rounded-3xl border shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all ${
              idx === 0 
                ? "bg-white dark:bg-[#1a1523] border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20" 
                : "bg-white dark:bg-[#1a1523] border-rose-100 dark:border-rose-900/40"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
                    {hospital.type}
                  </span>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Rank #1 Closest Center
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{hospital.distanceKm} km (~{hospital.estimatedDriveTimeMins} mins)</span>
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

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
                <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400">NICU Tier</div>
                    <div className="font-bold">{hospital.nicuLevel}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-900 dark:text-red-200 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400">Blood Bank & OT</div>
                    <div className="font-bold">{hospital.bloodBankAvailable ? "24/7 On-Site" : "On-Call"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
              {/* Inter-Module Auto Sync: Set as Primary Delivery Hospital */}
              {(() => {
                const isCurrentDelivery =
                  Boolean(user.hospitalName) &&
                  (user.hospitalName!.toLowerCase().includes(hospital.name.toLowerCase()) ||
                    hospital.name.toLowerCase().includes(user.hospitalName!.toLowerCase()));
                return (
                  <button
                    onClick={() => {
                      updateUserProfile({ hospitalName: hospital.name });
                      const alreadyContact = emergencyContacts.some(
                        (c) => c.name.toLowerCase().includes(hospital.name.toLowerCase())
                      );
                      if (!alreadyContact) {
                        addEmergencyContact({
                          name: hospital.name,
                          relation: "Primary Delivery Hospital",
                          phone: hospital.emergencyPhone,
                          address: hospital.address,
                          isPrimary: true,
                          notes: `Verified hospital with ${hospital.nicuLevel} NICU & ${hospital.bloodBankAvailable ? "24/7 Blood Bank" : "Blood Support"}.`,
                        });
                      }
                      showToast(`🏥 "${hospital.name}" is now your Primary Delivery Hospital & synced to Emergency Contacts! 💕`);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCurrentDelivery
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 ring-1 ring-emerald-500/20"
                        : "bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-100/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                    }`}
                  >
                    <Building2 className={`w-3.5 h-3.5 ${isCurrentDelivery ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`} />
                    <span>{isCurrentDelivery ? "✓ Selected Primary Delivery Hospital" : "Set as Primary Delivery Hospital"}</span>
                  </button>
                );
              })()}

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${hospital.emergencyPhone.replace(/\s+/g, "")}`}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Casualty</span>
                </a>

                <button
                  onClick={() => {
                    window.open(hospital.googleMapsUrl, "_blank");
                    showToast(`Opening live Google Maps directions to ${hospital.name}...`);
                  }}
                  className="flex-1 py-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Directions (Maps)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInTransitHospital(hospital);
                    showToast(`Active Navigation HUD started for ${hospital.name}! 🚗`);
                  }}
                  className="flex-1 py-2 bg-gray-100 dark:bg-[#201828] hover:bg-gray-200 text-gray-800 dark:text-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Car className="w-3.5 h-3.5 text-rose-500" />
                  <span>Start In-Transit HUD</span>
                </button>

                <button
                  onClick={() => shareHospitalToWhatsApp(hospital)}
                  className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  title="Share to WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedHospitals.length === 0 && (
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
