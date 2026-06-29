"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/shared/toast-provider";
import { Users, FileSpreadsheet, Cpu, Link as LinkIcon, Sparkles, ShieldCheck } from "lucide-react";

interface PatientQueueRow {
  id: string;
  name: string;
  nik: string;
  complaint: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "CRITICAL" | "STABLE";
  time: string;
}

export default function DoctorDashboardPage() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<PatientQueueRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEMRModalOpen, setIsEMRModalOpen] = useState(false);
  const [formSymptoms, setFormSymptoms] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Stats Sparklines
  const patientsSpark = [12, 14, 11, 15, 17, 16, 18];
  const emrSpark = [110, 115, 122, 130, 134, 138, 142];
  const timeSpark = [22, 21, 19, 18, 19, 18, 18];
  const ledgerSpark = [15880, 15885, 15890, 15895, 15898, 15900, 15902];

  // Queue Data
  const queueData: PatientQueueRow[] = [
    {
      id: "q-1",
      name: "Budi Santoso",
      nik: "3171012345670001",
      complaint: "Pusing hebat di bagian belakang kepala dan leher kaku",
      status: "CRITICAL",
      time: "09:15 WIB",
    },
    {
      id: "q-2",
      name: "Siti Rahmawati",
      nik: "3273019876540003",
      complaint: "Batuk berdahak lebih dari 2 minggu disertai demam malam hari",
      status: "PENDING",
      time: "09:30 WIB",
    },
    {
      id: "q-3",
      name: "Aditya Pratama",
      nik: "3174020912830005",
      complaint: "Nyeri ulu hati kronis dan kembung sesudah makan",
      status: "ACTIVE",
      time: "10:00 WIB",
    },
    {
      id: "q-4",
      name: "Dewi Lestari",
      nik: "3578031405920002",
      complaint: "Pemeriksaan gula darah rutin postprandial",
      status: "STABLE",
      time: "10:15 WIB",
    },
    {
      id: "q-5",
      name: "Eko Prasetyo",
      nik: "5171040811910004",
      complaint: "Luka robek pada telapak kaki kanan akibat goresan besi",
      status: "ACTIVE",
      time: "10:45 WIB",
    },
  ];

  // Column definitions for EMR queues
  const columns: ColumnDef[] = [
    {
      accessor: "name",
      header: "Nama Pasien",
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} size="sm" />
          <div>
            <div className="text-caption font-semibold text-neutral-800 dark:text-neutral-200">{val}</div>
            <div className="text-[10px] text-neutral-400 font-mono">{row.nik}</div>
          </div>
        </div>
      ),
    },
    {
      accessor: "complaint",
      header: "Keluhan Utama",
      render: (val) => <span className="line-clamp-1 max-w-[280px]">{val}</span>,
    },
    {
      accessor: "status",
      header: "Status Triase",
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      accessor: "time",
      header: "Waktu Kedatangan",
      sortable: true,
    },
  ];

  // Mock AI diagnostics assistant
  const handleAIAssist = () => {
    if (!formSymptoms) {
      toast({ title: "Validasi Gagal", description: "Masukkan keluhan gejala klinis terlebih dahulu.", type: "warning" });
      return;
    }
    setAiLoading(true);
    toast({ title: "MediAI Engine", description: "Menganalisis diagnosa banding...", type: "info" });
    
    setTimeout(() => {
      setAiSuggestions(`**Saran Diagnosa Banding MediAI:**
1. **Hipertensi Primer (ICD-10: I10)**
   - Berdasarkan gejala pusing hebat belakang kepala dan leher kaku.
   - Rekomendasi: Monitor tekanan darah arteri 3 kali berturut-turut.
2. **Sakit Kepala Tegang Kronis (Tension Headache) (ICD-10: G44.2)**
   - Faktor pendukung: Otot trapezius tegang.

**Rencana Pemeriksaan Lab:**
- Tes Profil Lipid Terintegrasi (Kolesterol Total, HDL, LDL, Trigliserida).
- Tes Gula Darah Puasa (GDP).`);
      setAiLoading(false);
      toast({ title: "Analisis Sukses", description: "Diagnosis AI berhasil digenerate.", type: "success" });
    }, 1500);
  };

  const handleCreateEMR = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEMRModalOpen(false);
    setFormSymptoms("");
    setAiSuggestions(null);
    toast({ title: "Sukses Menulis EMR", description: "Rekam medis telah ditandatangani dan diupload ke Hyperledger Fabric.", type: "success" });
  };

  return (
    <AppShell>
      <PageHeader
        title="Dashboard Portal Klinis"
        description="Pantau antrean pasien faskes, buat EMR baru terenkripsi, jalankan diagnosa AI, dan verifikasi integritas block rekam medis."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Dashboard Klinis" },
        ]}
        actions={
          <button
            onClick={() => setIsEMRModalOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Rekam Medis Baru
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Antrean Pasien Hari Ini" value="18 Pasien" change={5.2} sparklineData={patientsSpark} icon={Users} />
        <StatCard title="EMR Terverifikasi Blockchain" value="142 Record" change={14.2} sparklineData={emrSpark} icon={FileSpreadsheet} />
        <StatCard title="Rata-rata Waktu Layanan" value="18 Menit" change={-3.1} sparklineData={timeSpark} icon={Cpu} />
        <StatCard title="Hyperledger Height (Block)" value="#15,902" change={0.5} sparklineData={ledgerSpark} icon={LinkIcon} />
      </div>

      {/* Primary Dashboard Grid Layout (8 cols Table, 4 cols Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Queues Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/30 pb-3">
            <h2 className="text-heading-md font-semibold text-neutral-900 dark:text-white">
              Antrean Pelayanan Pasien
            </h2>
            <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full select-none">
              Hari ini
            </span>
          </div>
          
          <DataTable
            data={queueData}
            columns={columns}
            rowsPerPage={5}
            searchPlaceholder="Cari berdasarkan nama atau NIK..."
            onRowClick={(row) => {
              setSelectedPatient(row);
              setIsModalOpen(true);
            }}
          />
        </div>

        {/* Right Column: Ledger Logs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/30 pb-3">
            <h2 className="text-heading-md font-semibold text-neutral-900 dark:text-white">
              Audit Integrity Trail
            </h2>
            <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full select-none">
              Node #1
            </span>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/40 shadow-soft-1 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-caption font-semibold leading-none">Hyperledger Sync Terjaga</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Setiap mutasi klinis secara instan memicu penandatanganan kriptografik SHA-256 dan sinkronisasi BPJS SATUSEHAT.
              </p>
            </div>

            <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-soft-1">
              <div className="p-4 border-b border-neutral-200/50 dark:border-neutral-800/30">
                <span className="text-[10px] font-bold text-neutral-400 text-label-caps tracking-wider">Log Mutasi Terakhir</span>
              </div>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 p-4 space-y-3.5">
                
                <div className="first:pt-0 pt-3.5 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-neutral-800 dark:text-neutral-200 font-semibold">
                    <span>BLOCK #15902</span>
                    <span className="text-secondary">COMMITTED</span>
                  </div>
                  <div className="text-neutral-400 truncate">TX: 7f3c4dbde0ef14dbf77c8e9b6a12f91a50c822ff...</div>
                  <div className="text-[9px] text-neutral-500">Oleh: Dr. Andi Wijaya | 5 menit yang lalu</div>
                </div>

                <div className="pt-3.5 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-neutral-800 dark:text-neutral-200 font-semibold">
                    <span>BLOCK #15901</span>
                    <span className="text-secondary">COMMITTED</span>
                  </div>
                  <div className="text-neutral-400 truncate">TX: 2a3b4c5d6e7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b...</div>
                  <div className="text-[9px] text-neutral-500">Oleh: Dr. Andi Wijaya | 1 jam yang lalu</div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Patient Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detail Gejala & Triase Pasien"
        description="Ringkasan data klinis pre-konsultasi pasien dari antrean layanan."
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg text-caption font-semibold transition-all focus-ring cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setFormSymptoms(selectedPatient?.complaint || "");
                setIsEMRModalOpen(true);
              }}
              className="px-4 py-2 bg-primary text-white hover:bg-primary-600 rounded-lg text-caption font-semibold shadow-premium-sm transition-all focus-ring cursor-pointer"
            >
              Tulis EMR Pasien
            </button>
          </div>
        }
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 text-label-caps">Nama Lengkap</span>
                <p className="text-caption font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{selectedPatient.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 text-label-caps">NIK Pasien</span>
                <p className="text-caption font-mono text-neutral-800 dark:text-neutral-200 mt-0.5">{selectedPatient.nik}</p>
              </div>
            </div>
            
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-[10px] font-bold text-neutral-400 text-label-caps">Keluhan Utama</span>
              <p className="text-caption text-neutral-700 dark:text-neutral-300 mt-1">{selectedPatient.complaint}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 text-label-caps">Triase</span>
                <div className="mt-1">
                  <Badge variant={selectedPatient.status}>{selectedPatient.status}</Badge>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 text-label-caps">Waktu Datang</span>
                <p className="text-caption text-neutral-700 dark:text-neutral-300 mt-1">{selectedPatient.time}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create EMR Form Modal */}
      <Modal
        isOpen={isEMRModalOpen}
        onClose={() => setIsEMRModalOpen(false)}
        title="Input EMR Baru & Diagnosis AI"
        description="Gunakan asisten AI untuk memformulasikan saran diagnosa banding klinis berstandar ICD-10."
        size="lg"
      >
        <form onSubmit={handleCreateEMR} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Deskripsi Gejala Klinis (Subjective)
              </label>
              <textarea
                required
                value={formSymptoms}
                onChange={(e) => setFormSymptoms(e.target.value)}
                placeholder="Tulis keluhan pasien di sini..."
                className="w-full h-24 px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={aiLoading}
                className="px-3.5 py-2 bg-secondary hover:bg-secondary-600 text-white rounded-lg text-caption font-semibold flex items-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                {aiLoading ? "Menganalisis..." : "Formula AI Diagnosis"}
              </button>
            </div>

            {aiSuggestions && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-800/60 rounded-xl space-y-2 whitespace-pre-line text-neutral-700 dark:text-neutral-300 font-mono text-[11px] leading-relaxed select-all">
                {aiSuggestions}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Diagnosis Final (Objective)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Hipertensi Essensial..."
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
                />
              </div>
              <div>
                <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kode ICD-10
                </label>
                <input
                  type="text"
                  required
                  placeholder="I10"
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Rencana Tindakan & Terapi Obat (Treatment Plan)
              </label>
              <textarea
                required
                placeholder="Rencana rawat jalan..."
                className="w-full h-16 px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/30">
            <button
              type="button"
              onClick={() => setIsEMRModalOpen(false)}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg text-caption font-semibold transition-all focus-ring cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white hover:bg-primary-600 rounded-lg text-caption font-semibold shadow-premium-sm transition-all focus-ring cursor-pointer"
            >
              Simpan & Tanda Tangani
            </button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
