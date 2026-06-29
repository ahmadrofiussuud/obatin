"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/shared/toast-provider";
import {
  ShieldAlert,
  Printer,
  Save,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
} from "lucide-react";
import { MOCK_PATIENTS } from "@/lib/mock-data";

interface SymptomChip {
  id: string;
  name: string;
  category: "General" | "Respiratory" | "Cardiovascular" | "Gastrointestinal" | "Neurological";
}

const ALL_SYMPTOMS: SymptomChip[] = [
  { id: "s-1", name: "Demam (Fever)", category: "General" },
  { id: "s-2", name: "Kelelahah (Fatigue)", category: "General" },
  { id: "s-3", name: "Batuk Kering (Dry Cough)", category: "Respiratory" },
  { id: "s-4", name: "Sesak Napas (Dyspnea)", category: "Respiratory" },
  { id: "s-5", name: "Nyeri Dada (Chest Pain)", category: "Cardiovascular" },
  { id: "s-6", name: "Jantung Berdebar (Palpitations)", category: "Cardiovascular" },
  { id: "s-7", name: "Nyeri Ulu Hati (Epigastric Pain)", category: "Gastrointestinal" },
  { id: "s-8", name: "Mual (Nausea)", category: "Gastrointestinal" },
  { id: "s-9", name: "Pusing Belakang Kepala (Tension Headache)", category: "Neurological" },
  { id: "s-10", name: "Sakit Kepala Migrain (Migraine)", category: "Neurological" },
];

export default function DiagnosisToolPage() {
  const { toast } = useToast();

  // Step 1: Form Inputs states
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState(3);
  const [severity, setSeverity] = useState(5);
  
  // Vitals
  const [bpSys, setBpSys] = useState(120);
  const [bpDia, setBpDia] = useState(80);
  const [hr, setHr] = useState(72);
  const [temp, setTemp] = useState(36.5);
  const [spo2, setSpo2] = useState(98);
  const [rr, setRr] = useState(18);

  const [patientId, setPatientId] = useState("");


  // Step 2 & 3: AI results states
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSymptomToggle = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePatientSelect = (id: string) => {
    setPatientId(id);
    const p = MOCK_PATIENTS.find((item) => item.id === id);
    if (p) {

      // Auto-populate vitals if available (mocking some defaults based on patient profile)
      if (p.id === "P-001") {
        setBpSys(165);
        setBpDia(100);
        setTemp(36.6);
      } else if (p.id === "P-002") {
        setBpSys(115);
        setBpDia(75);
        setTemp(37.9);
      } else {
        setBpSys(120);
        setBpDia(80);
        setTemp(36.5);
      }
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) {
      toast({ title: "Analisis Gagal", description: "Pilih minimal 1 gejala utama terlebih dahulu.", type: "warning" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setIsAnalyzed(true);
      setLoading(false);
      toast({ title: "Analisis AI Selesai", description: "Diagnosis diferensial telah dibuat.", type: "success" });
    }, 1200);
  };

  // Determine red flag condition (high BP or fever combined with chest pain)
  const isRedFlag = bpSys >= 160 || bpDia >= 100 || (selectedSymptoms.includes("s-5") && spo2 < 95);

  return (
    <AppShell>
      <PageHeader
        title="Alat Pembantu Diagnosis AI"
        description="Lakukan triase klinis terpandu dengan input gejala klinis terstruktur, parameter vital pasien, dan analisis diferensial rekam medis."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Alat Diagnosis" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Symptom & Vital Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 space-y-6">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Triase Input Gejala & Vital
            </h3>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Langkah 1: Lengkapi profil klinis pasien</p>
          </div>

          {/* Patient Context Link */}
          <div className="space-y-2">
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300">
              Pilih Profil Pasien (Opsional)
            </label>
            <select
              value={patientId}
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
            >
              <option value="">-- Input Pasien Manual --</option>
              {MOCK_PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          {/* Categorized Symptom Chips */}
          <div className="space-y-3">
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300">
              Keluhan Gejala Utama
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {ALL_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    onClick={() => handleSymptomToggle(sym.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all select-none cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-neutral-50 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300"
                    }`}
                  >
                    {sym.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity & Duration Slider */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-350">
                Durasi Keluhan (Hari)
              </label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-caption font-semibold text-neutral-700 dark:text-neutral-350">
                <span>Skala Nyeri (VAS)</span>
                <span>{severity}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Vitals inputs */}
          <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300">
              Tanda-Tanda Vital (Vitals)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-caption font-semibold">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-450 block">Tensi Sistolik</span>
                <input
                  type="number"
                  value={bpSys}
                  onChange={(e) => setBpSys(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-450 block">Tensi Diastolik</span>
                <input
                  type="number"
                  value={bpDia}
                  onChange={(e) => setBpDia(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-450 block">Nadi (HR - bpm)</span>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-450 block">Suhu (°C)</span>
                <input
                  type="number"
                  step={0.1}
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-450 block">SpO2 (%)</span>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-450 block">Napas (RR - x/m)</span>
                <input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(Number(e.target.value))}
                  className="w-full px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Trigger button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center justify-center gap-2 shadow-premium-sm disabled:opacity-50 transition-all focus-ring cursor-pointer"
          >
            <Stethoscope className="h-4.5 w-4.5" />
            {loading ? "Menjalankan Diagnosa AI..." : "Mulai Analisis Diagnosis AI"}
          </button>
        </div>

        {/* RIGHT COLUMN: AI Analysis Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {isAnalyzed ? (
            <div className="space-y-6 animate-pulse-subtle">
              
              {/* Red Flag Warning Box */}
              {isRedFlag && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl space-y-2 text-rose-650 dark:text-rose-400 font-medium">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldAlert className="h-5 w-5 text-rose-500" />
                    <span>Peringatan Kondisi Kritis (Red Flag)</span>
                  </div>
                  <p className="text-caption leading-relaxed">
                    Terdeteksi Tekanan Darah Sistolik tinggi ({bpSys} mmHg) atau indikasi sesak napas berat. Evaluasi penanganan darurat (IGD) jika pasien mengeluh nyeri dada kiri menjalar atau leher kaku kram belakang.
                  </p>
                </div>
              )}

              {/* Primary Differential list */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 space-y-5">
                <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div>
                    <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      Rekomendasi Diagnosis Diferensial
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Langkah 2: Tinjau probabilitas AI Kemenkes</p>
                  </div>
                  
                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast({ title: "Cetak Laporan", description: "Mengirim berkas ke printer faskes...", type: "success" })}
                      className="p-1.5 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-500 transition-colors focus-ring cursor-pointer"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toast({ title: "Rekam Berhasil", description: "Hasil triase AI disimpan ke berkas pasien.", type: "success" })}
                      className="p-1.5 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-850 text-neutral-500 transition-colors focus-ring cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Top 3 suggestions */}
                <div className="space-y-4">
                  {/* Diagnosis 1 */}
                  <div className="space-y-2 border-b border-neutral-100 dark:border-neutral-850 pb-4 last:border-none last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-caption font-semibold text-neutral-800 dark:text-neutral-250">
                          Hipertensi Essensial Akut
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono">ICD-10: I10</span>
                      </div>
                      <Badge variant="CRITICAL">88% Confidence</Badge>
                    </div>
                    
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "88%" }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] pt-1">
                      <div className="space-y-1">
                        <div className="font-bold text-neutral-400 text-label-caps flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          Gejala Mendukung
                        </div>
                        <p className="text-neutral-550">Sistolik BP 165, keluhan pusing di bagian tengkuk leher belakang.</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="font-bold text-neutral-400 text-label-caps flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          Faktor Kontradiktif
                        </div>
                        <p className="text-neutral-550">Tidak ada sesak napas akut atau nyeri dada berat saat berbaring.</p>
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis 2 */}
                  <div className="space-y-2 border-b border-neutral-100 dark:border-neutral-850 pb-4 last:border-none last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-caption font-semibold text-neutral-800 dark:text-neutral-250">
                          Tension Headache (Sakit Kepala Tegang)
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono">ICD-10: G44.2</span>
                      </div>
                      <Badge variant="STABLE">65% Confidence</Badge>
                    </div>

                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Recommended Tests & Labs panel */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 space-y-4">
                <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Pemeriksaan Penunjang yang Disarankan
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Langkah 3: Panduan tes penunjang (lab/imaging)</p>
                </div>

                <div className="space-y-3 text-caption font-medium">
                  {/* Test 1 */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-neutral-800 dark:text-neutral-250">Lab Lipid Profil & Asam Urat</h4>
                      <p className="text-[11px] text-neutral-500">Mengevaluasi kadar lipid kolesterol LDL/HDL pasien pasca terapi amlodipine tinggi.</p>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 whitespace-nowrap bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full select-none">
                      Hasil: 1-2 Jam
                    </span>
                  </div>

                  {/* Test 2 */}
                  <div className="flex justify-between items-start gap-4 border-t border-neutral-100 dark:border-neutral-850 pt-3">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-neutral-800 dark:text-neutral-250">Elektrokardiogram (EKG 12-lead)</h4>
                      <p className="text-[11px] text-neutral-500">Mendeteksi hipertrofi ventrikel kiri (LVH) akibat pembebanan tekanan darah tinggi kronis.</p>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 whitespace-nowrap bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full select-none">
                      Hasil: Instan
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-8 shadow-soft-1 space-y-3">
              <Stethoscope className="h-12 w-12 text-neutral-300 animate-pulse" />
              <div>
                <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Belum Ada Analisis Diagnosa
                </h3>
                <p className="text-caption text-neutral-500 max-w-[280px] mx-auto leading-relaxed mt-1">
                  Masukkan gejala, durasi skala VAS, dan rekam vital pasien di kolom kiri kemudian klik tombol &quot;Mulai Analisis AI&quot;.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
