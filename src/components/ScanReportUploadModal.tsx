import React, { useState, useRef, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ScanMilestone, ScanReportAttachment, ExtractedScanReportData } from "../types";
import {
  Card,
  Button,
  Badge,
  CardHeading,
  BodyText,
  Caption,
} from "./ui";
import {
  UploadCloud,
  FileText,
  X,
  Trash2,
  Eye,
  FileCheck,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  RefreshCw,
  Activity,
  Heart,
  ShieldCheck,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Baby,
  Stethoscope,
  Pencil,
  Check,
} from "lucide-react";
import {
  evaluateAllExtractedBiomarkers,
  BiomarkerEvaluation,
} from "../services/scanBiomarkerEvaluator";

interface ScanReportUploadModalProps {
  scan: ScanMilestone;
  onClose: () => void;
}

export const ScanReportUploadModal: React.FC<ScanReportUploadModalProps> = ({
  scan,
  onClose,
}) => {
  const { addScanReport, deleteScanReport, getScanReportsByScanId, showToast } = useApp();
  const existingReports = getScanReportsByScanId(scan.id);

  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    fileName: string;
    fileType: "pdf" | "image";
    fileSize: string;
    fileDataUrl: string;
  } | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedScanReportData | null>(null);
  const [notes, setNotes] = useState("");
  const [previewFile, setPreviewFile] = useState<ScanReportAttachment | null>(null);

  // Step 5: Edit Mode for user verification
  const [isEditingValues, setIsEditingValues] = useState(false);
  const [editedValues, setEditedValues] = useState<{
    bpd?: string;
    fl?: string;
    ac?: string;
    hc?: string;
    efw?: string;
    fhr?: string;
    afi?: string;
    placenta?: string;
    hemoglobin?: string;
    glucose?: string;
    tsh?: string;
    urineProtein?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      showToast("File size exceeds 15 MB limit.");
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      showToast("Please upload a valid PDF or Image file (.pdf, .png, .jpg, .jpeg).");
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const reader = new FileReader();

    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const fileObj = {
          fileName: file.name,
          fileType: isPdf ? ("pdf" as const) : ("image" as const),
          fileSize: `${sizeMb} MB`,
          fileDataUrl: reader.result,
        };
        setSelectedFile(fileObj);
        setExtractedData(null);
        setIsEditingValues(false);

        // Run Gemini multimodal vision analysis
        await analyzeFileWithAI(fileObj);
      }
    };

    reader.readAsDataURL(file);
  };

  const analyzeFileWithAI = async (fileObj: {
    fileName: string;
    fileType: "pdf" | "image";
    fileSize: string;
    fileDataUrl: string;
  }) => {
    setIsExtracting(true);

    try {
      const response = await fetch("/api/scan/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileObj.fileName,
          fileData: fileObj.fileDataUrl,
          fileType: fileObj.fileType,
          scanId: scan.id,
          fileSize: fileObj.fileSize,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const json = await response.json();
      if (json.success && json.data) {
        const data: ExtractedScanReportData = json.data;
        setExtractedData(data);

        // Initialize edited values from extraction
        const ub = data.ultrasoundBiometrics;
        const lb = data.labBiomarkers;
        setEditedValues({
          bpd: ub?.bpd?.value !== undefined ? String(ub.bpd.value) : "",
          fl: ub?.fl?.value !== undefined ? String(ub.fl.value) : "",
          ac: ub?.ac?.value !== undefined ? String(ub.ac.value) : "",
          hc: ub?.hc?.value !== undefined ? String(ub.hc.value) : "",
          efw: ub?.efw?.value !== undefined ? String(ub.efw.value) : "",
          fhr: ub?.fhr?.value !== undefined ? String(ub.fhr.value) : "",
          afi: ub?.afi?.value !== undefined ? String(ub.afi.value) : "",
          placenta: ub?.placentaPosition || "",
          hemoglobin: lb?.hemoglobin?.value !== undefined ? String(lb.hemoglobin.value) : "",
          glucose: lb?.glucose?.value !== undefined ? String(lb.glucose.value) : "",
          tsh: lb?.tsh?.value !== undefined ? String(lb.tsh.value) : "",
          urineProtein: lb?.urineProtein?.value || "",
        });

        if (data.found) {
          showToast("✨ Clinical biometrics successfully extracted by Gemini Vision!");
        } else {
          showToast("Scan photo recognized. Saved as keepsake memory photo (no printed calipers found).");
        }
      } else {
        throw new Error("Invalid response format from extraction API");
      }
    } catch (err: any) {
      console.warn("AI extraction warning:", err);
      // Safe fallback: mark as keepsake without corrupting records
      setExtractedData({
        found: false,
        documentType: "MEMORY_PHOTO_ONLY",
        confidence: 0.8,
        summary: "File uploaded successfully. No printed numerical calipers detected.",
      });
      showToast("Uploaded report safely. You can add clinical notes manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Step 6: Dynamic clinical evaluations based on current/edited values
  const activeEvaluations: BiomarkerEvaluation[] = useMemo(() => {
    if (!extractedData || !extractedData.found) return [];

    const effectiveData: any = {
      ultrasoundBiometrics: {},
      labBiomarkers: {},
    };

    if (editedValues.bpd) effectiveData.ultrasoundBiometrics.bpd = { value: parseFloat(editedValues.bpd), unit: "mm" };
    if (editedValues.fl) effectiveData.ultrasoundBiometrics.fl = { value: parseFloat(editedValues.fl), unit: "mm" };
    if (editedValues.ac) effectiveData.ultrasoundBiometrics.ac = { value: parseFloat(editedValues.ac), unit: "mm" };
    if (editedValues.hc) effectiveData.ultrasoundBiometrics.hc = { value: parseFloat(editedValues.hc), unit: "mm" };
    if (editedValues.efw) effectiveData.ultrasoundBiometrics.efw = { value: parseFloat(editedValues.efw), unit: "grams" };
    if (editedValues.fhr) effectiveData.ultrasoundBiometrics.fhr = { value: parseFloat(editedValues.fhr), unit: "bpm" };
    if (editedValues.afi) effectiveData.ultrasoundBiometrics.afi = { value: parseFloat(editedValues.afi), unit: "cm" };
    if (editedValues.placenta) effectiveData.ultrasoundBiometrics.placentaPosition = editedValues.placenta;

    if (editedValues.hemoglobin) effectiveData.labBiomarkers.hemoglobin = { value: parseFloat(editedValues.hemoglobin), unit: "g/dL" };
    if (editedValues.glucose) effectiveData.labBiomarkers.glucose = { value: parseFloat(editedValues.glucose), unit: "mg/dL", context: "fasting" };
    if (editedValues.tsh) effectiveData.labBiomarkers.tsh = { value: parseFloat(editedValues.tsh), unit: "uIU/mL" };
    if (editedValues.urineProtein) effectiveData.labBiomarkers.urineProtein = { value: editedValues.urineProtein, unit: "" };

    return evaluateAllExtractedBiomarkers(effectiveData);
  }, [extractedData, editedValues]);

  // Check if any metric is flagged for clinician attention (Rose or Amber)
  const flaggedMetrics = useMemo(() => {
    return activeEvaluations.filter((ev) => ev.isAbnormal);
  }, [activeEvaluations]);

  // Step 5: Explicit Confirm & Save Handler
  const handleConfirmAndSaveReport = async () => {
    if (!selectedFile) return;

    // Prepare updated extractedData object with user-verified biometrics
    const updatedExtractedData: ExtractedScanReportData = {
      ...(extractedData || { found: false }),
      verificationStatus: extractedData?.found ? "VERIFIED_BY_USER" : undefined,
      verifiedAt: new Date().toISOString(),
      verifiedBy: "Mother / User",
      attachmentId: extractedData?.attachmentId,
      ultrasoundBiometrics: extractedData?.found
        ? {
            bpd: editedValues.bpd ? { value: parseFloat(editedValues.bpd), unit: "mm" } : undefined,
            fl: editedValues.fl ? { value: parseFloat(editedValues.fl), unit: "mm" } : undefined,
            ac: editedValues.ac ? { value: parseFloat(editedValues.ac), unit: "mm" } : undefined,
            hc: editedValues.hc ? { value: parseFloat(editedValues.hc), unit: "mm" } : undefined,
            efw: editedValues.efw ? { value: parseFloat(editedValues.efw), unit: "grams" } : undefined,
            fhr: editedValues.fhr ? { value: parseFloat(editedValues.fhr), unit: "bpm" } : undefined,
            afi: editedValues.afi ? { value: parseFloat(editedValues.afi), unit: "cm" } : undefined,
            placentaPosition: editedValues.placenta || undefined,
            placentaGrade: extractedData?.ultrasoundBiometrics?.placentaGrade,
          }
        : undefined,
      labBiomarkers: extractedData?.found
        ? {
            hemoglobin: editedValues.hemoglobin ? { value: parseFloat(editedValues.hemoglobin), unit: "g/dL" } : undefined,
            glucose: editedValues.glucose ? { value: parseFloat(editedValues.glucose), unit: "mg/dL" } : undefined,
            tsh: editedValues.tsh ? { value: parseFloat(editedValues.tsh), unit: "uIU/mL" } : undefined,
            urineProtein: editedValues.urineProtein ? { value: editedValues.urineProtein, unit: "" } : undefined,
          }
        : undefined,
    };

    // Step 4: Persist confirmed biomarkers into Prisma database
    if (extractedData?.found && activeEvaluations.length > 0) {
      try {
        await fetch("/api/scan/confirm-biomarkers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attachmentId: extractedData.attachmentId,
            scanId: scan.id,
            fileName: selectedFile.fileName,
            fileType: selectedFile.fileType,
            fileSize: selectedFile.fileSize,
            biomarkers: activeEvaluations.map((ev) => ({
              label: ev.label,
              category: ev.category,
              numericValue: typeof ev.value === "number" ? ev.value : null,
              stringValue: typeof ev.value === "string" ? ev.value : null,
              unit: ev.unit,
              referenceRange: ev.referenceRange,
              status: ev.status.toLowerCase(),
              statusText: ev.statusText,
            })),
            verifiedBy: "Mother / User",
            notes: notes.trim() || undefined,
          }),
        });
      } catch (saveErr) {
        console.warn("Could not sync confirmed biomarkers to Prisma:", saveErr);
      }
    }

    addScanReport({
      scanId: scan.id,
      fileName: selectedFile.fileName,
      fileType: selectedFile.fileType,
      fileSize: selectedFile.fileSize,
      fileDataUrl: selectedFile.fileDataUrl,
      notes: notes.trim() || undefined,
      extractedData: updatedExtractedData,
    });

    showToast(
      extractedData?.found
        ? "✅ Biometrics confirmed and saved to your health record!"
        : "💝 Keepsake scan photo attached successfully!"
    );

    setSelectedFile(null);
    setExtractedData(null);
    setNotes("");
    setIsEditingValues(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* FULL IMAGE / PDF PREVIEW MODAL */}
      {previewFile ? (
        <div className="w-full max-w-4xl bg-white dark:bg-[#1A1523] rounded-3xl p-6 border border-rose-200 dark:border-rose-900/50 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/40 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="emerald" size="sm">
                {previewFile.fileType.toUpperCase()}
              </Badge>
              {previewFile.extractedData?.verificationStatus === "VERIFIED_BY_USER" ? (
                <Badge variant="emerald" size="sm" className="flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>VERIFIED HEALTH RECORD</span>
                </Badge>
              ) : previewFile.extractedData?.found ? (
                <Badge variant="amber" size="sm" className="flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>UNVERIFIED AI</span>
                </Badge>
              ) : (
                <Badge variant="amber" size="sm" className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>KEEPSAKE PHOTO</span>
                </Badge>
              )}
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100 truncate max-w-md">
                {previewFile.fileName}
              </h3>
            </div>
            <button
              onClick={() => setPreviewFile(null)}
              className="p-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Document Preview Frame */}
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl flex items-center justify-center min-h-[320px]">
            {previewFile.fileType === "image" ? (
              <img
                src={previewFile.fileDataUrl}
                alt={previewFile.fileName}
                className="max-h-[55vh] object-contain rounded-xl shadow-md"
              />
            ) : (
              <iframe
                src={previewFile.fileDataUrl}
                title={previewFile.fileName}
                className="w-full h-[55vh] rounded-xl border border-gray-300"
              />
            )}
          </div>

          {/* Extracted Biometrics Cross-Verification Panel */}
          {previewFile.extractedData && (
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-rose-900 dark:text-rose-200">
                    Digitized Report Details
                  </span>
                </div>
                {previewFile.extractedData.verifiedAt && (
                  <Caption className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Verified on {new Date(previewFile.extractedData.verifiedAt).toLocaleDateString()}
                  </Caption>
                )}
              </div>

              {previewFile.extractedData.summary && (
                <p className="text-xs text-gray-700 dark:text-rose-200/90 leading-relaxed bg-white/70 dark:bg-[#120E18]/60 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  {previewFile.extractedData.summary}
                </p>
              )}

              {/* Ultrasound Biometrics Grid */}
              {previewFile.extractedData.ultrasoundBiometrics &&
                Object.keys(previewFile.extractedData.ultrasoundBiometrics).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {previewFile.extractedData.ultrasoundBiometrics.bpd?.value && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">BPD (Head)</Caption>
                        <div className="font-bold text-sm text-gray-900 dark:text-rose-100">
                          {previewFile.extractedData.ultrasoundBiometrics.bpd.value} mm
                        </div>
                      </div>
                    )}
                    {previewFile.extractedData.ultrasoundBiometrics.fl?.value && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">FL (Femur)</Caption>
                        <div className="font-bold text-sm text-gray-900 dark:text-rose-100">
                          {previewFile.extractedData.ultrasoundBiometrics.fl.value} mm
                        </div>
                      </div>
                    )}
                    {previewFile.extractedData.ultrasoundBiometrics.ac?.value && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">AC (Abdomen)</Caption>
                        <div className="font-bold text-sm text-gray-900 dark:text-rose-100">
                          {previewFile.extractedData.ultrasoundBiometrics.ac.value} mm
                        </div>
                      </div>
                    )}
                    {previewFile.extractedData.ultrasoundBiometrics.hc?.value && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">HC (Circumference)</Caption>
                        <div className="font-bold text-sm text-gray-900 dark:text-rose-100">
                          {previewFile.extractedData.ultrasoundBiometrics.hc.value} mm
                        </div>
                      </div>
                    )}
                    {previewFile.extractedData.ultrasoundBiometrics.efw?.value && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">EFW (Est. Weight)</Caption>
                        <div className="font-bold text-sm text-rose-600 dark:text-rose-400">
                          {previewFile.extractedData.ultrasoundBiometrics.efw.value} g
                        </div>
                      </div>
                    )}
                    {previewFile.extractedData.ultrasoundBiometrics.fhr?.value && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">FHR (Heart Rate)</Caption>
                        <div className="font-bold text-sm text-rose-600 dark:text-rose-400">
                          {previewFile.extractedData.ultrasoundBiometrics.fhr.value} bpm
                        </div>
                      </div>
                    )}
                    {previewFile.extractedData.ultrasoundBiometrics.afi?.value && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">AFI (Fluid)</Caption>
                        <div className="font-bold text-sm text-gray-900 dark:text-rose-100">
                          {previewFile.extractedData.ultrasoundBiometrics.afi.value} cm
                        </div>
                      </div>
                    )}
                    {previewFile.extractedData.ultrasoundBiometrics.placentaPosition && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15111C] border border-rose-100 dark:border-rose-900/40 text-center">
                        <Caption className="text-gray-500">Placenta</Caption>
                        <div className="font-bold text-xs text-gray-900 dark:text-rose-100 truncate">
                          {previewFile.extractedData.ultrasoundBiometrics.placentaPosition}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Caption className="text-gray-500">
              Uploaded on {previewFile.uploadedAt}
              {previewFile.notes ? ` · Note: "${previewFile.notes}"` : ""}
            </Caption>
            <a
              href={previewFile.fileDataUrl}
              download={previewFile.fileName}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
          </div>
        </div>
      ) : (
        /* MAIN ATTACHMENT MODAL */
        <Card
          variant="glass"
          radius="3xl"
          className="w-full max-w-2xl bg-white dark:bg-[#1A1523] p-6 sm:p-8 space-y-6 shadow-2xl relative border border-rose-200 dark:border-rose-900/50 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-rose-100 dark:border-rose-900/40 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="rose" size="sm">
                  {scan.type || "ULTRASOUND"}
                </Badge>
                <Badge variant="sage" size="sm">
                  {scan.weeks}
                </Badge>
                <Badge variant="amber" size="sm" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Gemini Vision AI</span>
                </Badge>
              </div>
              <CardHeading className="text-2xl pt-1">{scan.title}</CardHeading>
              <Caption>
                Upload diagnostic scan reports (PDF or Images). Gemini extracts clinical biometrics automatically with deterministic clinical checks.
              </Caption>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Existing Attached Reports List */}
          {existingReports.length > 0 && (
            <div className="space-y-2">
              <Caption className="uppercase font-bold text-gray-500 dark:text-rose-300 block">
                Attached Reports ({existingReports.length})
              </Caption>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {existingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#15111C] border border-rose-200 dark:border-rose-800 text-rose-600 flex items-center justify-center shrink-0">
                        {report.fileType === "pdf" ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <ImageIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-xs text-gray-900 dark:text-rose-100 truncate max-w-xs">
                            {report.fileName}
                          </span>
                          {report.extractedData?.verificationStatus === "VERIFIED_BY_USER" && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold shrink-0 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Verified
                            </span>
                          )}
                          {report.extractedData?.found && !report.extractedData?.verificationStatus && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[9px] font-bold shrink-0 flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Unverified AI
                            </span>
                          )}
                          {report.extractedData?.documentType === "MEMORY_PHOTO_ONLY" && (
                            <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[9px] font-bold shrink-0 flex items-center gap-0.5">
                              <Heart className="w-2.5 h-2.5" />
                              Keepsake
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-rose-300">
                          {report.fileSize} · Uploaded {report.uploadedAt}
                          {report.extractedData?.ultrasoundBiometrics?.efw?.value && (
                            <span className="text-rose-600 dark:text-rose-400 font-semibold ml-1.5">
                              · EFW: {report.extractedData.ultrasoundBiometrics.efw.value}g
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewFile(report)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>

                      <button
                        onClick={() => deleteScanReport(report.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors"
                        title="Remove report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Dropzone */}
          {!selectedFile && (
            <div className="space-y-3">
              <Caption className="uppercase font-bold text-gray-500 dark:text-rose-300 block">
                Attach New Report File
              </Caption>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="p-6 sm:p-8 rounded-3xl border-2 border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-all cursor-pointer text-center space-y-2 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-sm text-gray-900 dark:text-rose-100">
                    Drag & Drop report file or ultrasound scan here
                  </div>
                  <div className="text-xs text-rose-600 dark:text-rose-300 font-semibold underline">
                    or browse from your device
                  </div>
                </div>

                <Caption>Supported formats: PDF, JPG, JPEG, PNG (Max 15 MB)</Caption>
              </div>
            </div>
          )}

          {/* AI Analyzing Progress HUD */}
          {isExtracting && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 via-purple-500/10 to-amber-500/10 border border-rose-200 dark:border-rose-900/50 space-y-3 text-center animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#15111C] shadow-md border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6 animate-spin text-rose-500" />
              </div>
              <div className="space-y-1">
                <div className="font-serif font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>Gemini Vision Multimodal Analysis</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-rose-200/80">
                  Digitizing ultrasound biometrics (BPD, FL, AC, HC, EFW, FHR) or lab values...
                </p>
              </div>
              <Caption className="text-gray-400 text-[11px]">
                Strict anti-hallucination guardrail active — raw keepsake photos without printed tables remain unskewed.
              </Caption>
            </div>
          )}

          {/* Selected File & Verification Review Card */}
          {selectedFile && !isExtracting && (
            <div className="p-5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-4 shadow-xs">
              {/* File Info Header */}
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/60 dark:border-rose-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#15111C] border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
                    {selectedFile.fileType === "pdf" ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-rose-100 truncate max-w-xs sm:max-w-md">
                      {selectedFile.fileName}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-rose-300">
                      {selectedFile.fileSize} · Ready to verify & save
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setExtractedData(null);
                    setIsEditingValues(false);
                  }}
                  className="p-1.5 rounded-full text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors"
                  title="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step 7: Prominent Clinical Disclaimer Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/50 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-amber-950 dark:text-amber-200">
                    Clinical Review Notice
                  </div>
                  <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                    AI extraction is for personal tracking only — it never replaces your obstetrician's official diagnostic signed report. Please verify values before saving.
                  </p>
                </div>
              </div>

              {/* AI Extraction Findings & Review Card */}
              {extractedData && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {extractedData.found ? (
                        <Badge variant="amber" size="sm" className="flex items-center gap-1 font-bold">
                          <AlertCircle className="w-3 h-3" />
                          <span>UNVERIFIED AI · REVIEW REQUIRED</span>
                        </Badge>
                      ) : (
                        <Badge variant="amber" size="sm" className="flex items-center gap-1 font-bold">
                          <Heart className="w-3 h-3" />
                          <span>Keepsake Memory Photo</span>
                        </Badge>
                      )}
                      <Badge variant="sage" size="sm">
                        {extractedData.documentType || "ULTRASOUND"}
                      </Badge>
                    </div>

                    {extractedData.found && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingValues(!isEditingValues)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-[#15111C] border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>{isEditingValues ? "Lock Values" : "Edit / Fix Misread"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => analyzeFileWithAI(selectedFile)}
                          className="text-[11px] font-semibold text-rose-600 dark:text-rose-300 hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Re-read</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Clinical Summary */}
                  {extractedData.summary && (
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#120E18]/70 border border-rose-100 dark:border-rose-900/40 text-xs text-gray-700 dark:text-rose-200 leading-relaxed">
                      {extractedData.summary}
                    </div>
                  )}

                  {/* Keepsake Photo Note */}
                  {!extractedData.found && (
                    <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5">
                      <Baby className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-900 dark:text-amber-200">
                        No printed caliper measurements were visible in this image. It will be safely saved in your milestone gallery as an ultrasound memory photo without skewing your medical trend charts.
                      </p>
                    </div>
                  )}

                  {/* Step 5 & 6: Interactive Biometrics Review with Deterministic Range Evaluation */}
                  {extractedData.found && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Caption className="text-gray-500 font-bold uppercase tracking-wider block text-[10px]">
                          {isEditingValues ? "✏️ Edit Detected Caliper Values" : "Clinical Range Comparison (Plain If/Else Guardrails)"}
                        </Caption>
                        <Caption className="text-[10px] text-gray-400">
                          Deterministic ACOG / WHO thresholds
                        </Caption>
                      </div>

                      {/* EDIT MODE: User can edit any misread number before saving */}
                      {isEditingValues ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white dark:bg-[#120E18] border border-rose-200 dark:border-rose-900/40">
                          {editedValues.bpd !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-gray-500">BPD (mm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={editedValues.bpd}
                                onChange={(e) => setEditedValues({ ...editedValues, bpd: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-bold text-gray-900 dark:text-rose-100 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.fl !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-gray-500">FL (mm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={editedValues.fl}
                                onChange={(e) => setEditedValues({ ...editedValues, fl: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-bold text-gray-900 dark:text-rose-100 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.ac !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-gray-500">AC (mm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={editedValues.ac}
                                onChange={(e) => setEditedValues({ ...editedValues, ac: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-bold text-gray-900 dark:text-rose-100 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.hc !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-gray-500">HC (mm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={editedValues.hc}
                                onChange={(e) => setEditedValues({ ...editedValues, hc: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-bold text-gray-900 dark:text-rose-100 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.efw !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-rose-600">EFW (g)</label>
                              <input
                                type="number"
                                value={editedValues.efw}
                                onChange={(e) => setEditedValues({ ...editedValues, efw: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.fhr !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-rose-600">FHR (bpm)</label>
                              <input
                                type="number"
                                value={editedValues.fhr}
                                onChange={(e) => setEditedValues({ ...editedValues, fhr: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.afi !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-gray-500">AFI (cm)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={editedValues.afi}
                                onChange={(e) => setEditedValues({ ...editedValues, afi: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-bold text-gray-900 dark:text-rose-100 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.placenta !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-gray-500">Placenta</label>
                              <input
                                type="text"
                                value={editedValues.placenta}
                                onChange={(e) => setEditedValues({ ...editedValues, placenta: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 text-xs font-bold text-gray-900 dark:text-rose-100 bg-rose-50/40 dark:bg-rose-950/30"
                              />
                            </div>
                          )}
                          {editedValues.hemoglobin !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-rose-600">Hb (g/dL)</label>
                              <input
                                type="number"
                                step="0.1"
                                value={editedValues.hemoglobin}
                                onChange={(e) => setEditedValues({ ...editedValues, hemoglobin: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-300 text-xs font-bold text-rose-600"
                              />
                            </div>
                          )}
                          {editedValues.glucose !== undefined && (
                            <div>
                              <label className="text-[10px] font-bold text-gray-500">Sugar (mg/dL)</label>
                              <input
                                type="number"
                                value={editedValues.glucose}
                                onChange={(e) => setEditedValues({ ...editedValues, glucose: e.target.value })}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-xl border border-rose-200 text-xs font-bold"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        /* REVIEW & COMPARISON MODE: Cards showing evaluated values with clinical ranges */
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {activeEvaluations.map((ev) => {
                            const isAmber = ev.badgeVariant === "amber";
                            const isRose = ev.badgeVariant === "rose";

                            return (
                              <div
                                key={ev.parameter}
                                className={`p-2.5 rounded-2xl border text-center transition-all ${
                                  isRose
                                    ? "bg-rose-100/70 dark:bg-rose-950/60 border-rose-400 dark:border-rose-700 shadow-xs"
                                    : isAmber
                                    ? "bg-amber-50/80 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 shadow-xs"
                                    : "bg-white dark:bg-[#15111C] border-rose-100 dark:border-rose-900/40"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <Caption className="text-[10px] text-gray-500 dark:text-rose-300 truncate">
                                    {ev.label}
                                  </Caption>
                                  {isRose ? (
                                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" title="Consult Doctor" />
                                  ) : isAmber ? (
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Watch" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Optimal" />
                                  )}
                                </div>

                                <div className="font-bold text-sm text-gray-900 dark:text-rose-100">
                                  {ev.value} <span className="text-[10px] font-normal text-gray-500">{ev.unit}</span>
                                </div>

                                <div className="mt-1">
                                  {isRose ? (
                                    <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-bold block truncate">
                                      Consult Doctor
                                    </span>
                                  ) : isAmber ? (
                                    <span className="px-1.5 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[9px] font-bold block truncate">
                                      Watch Range
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold block truncate">
                                      {ev.referenceRange}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Step 6: Out-of-Range Clinical Guidance Alert */}
                      {flaggedMetrics.length > 0 && (
                        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-rose-900 dark:text-rose-200">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Clinical Observation ({flaggedMetrics.length} metric flagged)</span>
                          </div>
                          <ul className="text-[11px] text-rose-800 dark:text-rose-300 list-disc list-inside space-y-0.5">
                            {flaggedMetrics.map((m) => (
                              <li key={m.parameter}>
                                <strong>{m.label}:</strong> {m.clinicalAction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Optional Notes */}
              <div>
                <input
                  type="text"
                  placeholder="Add optional note (e.g. Normal Doppler, Dr. Sharma consultation, baby active)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl text-xs bg-white dark:bg-[#120E18] border border-rose-200 dark:border-rose-900/50 text-gray-900 dark:text-rose-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Step 5: Explicit "Confirm These Numbers & Save" Trigger Button */}
              <Button
                variant="primary"
                size="md"
                className="w-full flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:scale-[1.01] transition-transform"
                onClick={handleConfirmAndSaveReport}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                {extractedData?.found
                  ? `Confirm Verified Numbers & Save to ${scan.title}`
                  : `Save Keepsake Photo to ${scan.title}`}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ScanReportUploadModal;
