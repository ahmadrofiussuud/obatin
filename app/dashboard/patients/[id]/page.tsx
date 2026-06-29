"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";

import {
  CalendarDays,
  Building,
  Heart,
  Scale,
  Ruler,
  AlertOctagon,
  Pill,
  QrCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MOCK_PATIENTS, MockPatient } from "@/lib/mock-data";

export default function PatientDetailPage() {
  const { id } = useParams();

  
  // Tab selector state
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "labs" | "prescriptions" | "blockchain">("overview");
  
  // Accordion state for SOAP notes
  const [openSoapId, setOpenSoapId] = useState<string | null>("soap-1");
  
  // QR modal state
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Retrieve patient
  const patient: MockPatient | undefined = MOCK_PATIENTS.find((p) => p.id === id);

  if (!patient) {
    return (
      <AppShell>
        <EmptyState
          title="Pasien Tidak Ditemukan"
          description="ID rekam medis tidak terdaftar di faskes ini atau salah ketik."
        />
      </AppShell>
    );
  }

  const tabs = [
    { id: "overview", label: "Ikhtisar Kunjungan" },
    { id: "records", label: "Rekam Medis (SOAP)" },
    { id: "labs", label: "Hasil Laboratorium" },
    { id: "prescriptions", label: "Resep Digital" },
    { id: "blockchain", label: "Audit Kriptografik" },
  ] as const;

  return (
    <AppShell>
      <PageHeader
        title={`Rekam Medis: ${patient.name}`}
        description="Profil terenkripsi SATUSEHAT. Lakukan review kondisi pasien dan audit hash integritas blockchain."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Berkas Pasien", href: "/dashboard/patients" },
          { label: patient.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* LEFT COLUMN (30%) - Patient Demographic Card */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 text-center space-y-4">
            
            {/* Header profile details */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar name={patient.name} size="lg" isOnline={patient.status === "ACTIVE"} />
              <div>
                <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {patient.name}
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{patient.id}</p>
              </div>
              <Badge variant={patient.status}>{patient.status}</Badge>
            </div>

            {/* QR Card trigger */}
            <button
              onClick={() => setIsQrOpen(true)}
              className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-750 text-caption font-semibold rounded-lg flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-350 transition-all focus-ring cursor-pointer"
            >
              <QrCode className="h-4 w-4" />
              Digital Medical ID QR
            </button>

            {/* Vitals stats */}
            <div className="grid grid-cols-3 gap-2 border-y border-neutral-100 dark:border-neutral-800/60 py-3.5 text-center leading-none">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Gol. Darah</span>
                <span className="text-caption font-semibold text-neutral-850 dark:text-white mt-1 inline-block flex items-center justify-center gap-0.5">
                  <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                  {patient.bloodType}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Berat (kg)</span>
                <span className="text-caption font-semibold text-neutral-850 dark:text-white mt-1 inline-block flex items-center justify-center gap-0.5">
                  <Scale className="h-3 w-3 text-neutral-400" />
                  {patient.weight}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Tinggi (cm)</span>
                <span className="text-caption font-semibold text-neutral-850 dark:text-white mt-1 inline-block flex items-center justify-center gap-0.5">
                  <Ruler className="h-3 w-3 text-neutral-400" />
                  {patient.height}
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="text-left space-y-1">
              <span className="text-[9px] font-bold text-neutral-400 text-label-caps">Kontak Darurat</span>
              <p className="text-caption font-semibold text-neutral-800 dark:text-neutral-200 leading-none">
                {patient.emergencyContact.name}
              </p>
              <p className="text-[10px] text-neutral-500 leading-none">
                {patient.emergencyContact.phone} ({patient.emergencyContact.relation})
              </p>
            </div>

            {/* Vitals calculations */}
            <div className="text-left space-y-1">
              <span className="text-[9px] font-bold text-neutral-400 text-label-caps">Indeks Massa Tubuh (BMI)</span>
              <div className="flex items-center gap-3">
                <span className="text-caption font-semibold text-neutral-800 dark:text-neutral-200">
                  {patient.bmi}
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded font-bold leading-none uppercase">
                  Overweight
                </span>
              </div>
            </div>

            {/* Active Conditions */}
            <div className="text-left space-y-1.5">
              <span className="text-[9px] font-bold text-neutral-400 text-label-caps">Diagnosis Aktif</span>
              <div className="flex flex-wrap gap-1">
                {patient.conditions.map((c) => (
                  <span key={c} className="text-[10px] bg-primary-50 text-primary dark:bg-primary-950/20 dark:text-primary-400 px-2 py-0.5 rounded border border-primary-200/40 dark:border-primary-900/30 font-semibold select-none">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="text-left space-y-1.5">
              <span className="text-[9px] font-bold text-neutral-400 text-label-caps text-rose-500">Alergi Terdaftar</span>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((a) => (
                    <span key={a} className="text-[10px] bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 px-2 py-0.5 rounded border border-rose-200/45 dark:border-rose-900/30 font-semibold select-none flex items-center gap-0.5">
                      <AlertOctagon className="h-3 w-3" />
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-neutral-400 italic">Tidak ada alergi terdaftar</span>
                )}
              </div>
            </div>

            {/* Medications */}
            <div className="text-left space-y-1.5">
              <span className="text-[9px] font-bold text-neutral-400 text-label-caps">Pengobatan Rutin</span>
              <div className="flex flex-wrap gap-1">
                {patient.medications.length > 0 ? (
                  patient.medications.map((m) => (
                    <span key={m} className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 px-2 py-0.5 rounded border border-emerald-200/45 dark:border-emerald-900/30 font-semibold select-none flex items-center gap-0.5">
                      <Pill className="h-3 w-3" />
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-neutral-400 italic">Tidak ada obat rutin</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (70%) - Tabbed Medical Record */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl shadow-soft-1 flex flex-col min-h-[500px]">
          
          {/* Tabs bar */}
          <div className="border-b border-neutral-200/60 dark:border-neutral-800/40 flex overflow-x-auto select-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-caption font-semibold border-b-2 whitespace-nowrap transition-colors focus:outline-none focus-ring ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab contents body */}
          <div className="p-6 flex-grow">
            
            {/* TAB 1: Visits Overview */}
            {activeTab === "overview" && (
              <div className="relative border-l border-neutral-200 dark:border-neutral-850 pl-5 space-y-6">
                {patient.visits.map((visit, idx) => (
                  <div key={idx} className="relative space-y-1 text-caption animate-pulse-subtle">
                    {/* Timeline bullet */}
                    <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white dark:ring-neutral-900" />
                    
                    <div className="flex items-center gap-2 text-neutral-400 font-semibold">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{visit.date}</span>
                      <span>•</span>
                      <Building className="h-3.5 w-3.5" />
                      <span>{visit.facility}</span>
                    </div>
                    
                    <p className="text-body-md font-semibold text-neutral-800 dark:text-neutral-200">
                      {visit.chiefComplaint}
                    </p>
                    <p className="text-caption text-neutral-600 dark:text-neutral-300 font-medium">
                      Pemeriksaan oleh <span className="font-semibold text-neutral-700 dark:text-white">{visit.doctor}</span>. <br />
                      Diagnosis: <span className="font-semibold text-neutral-700 dark:text-white">{visit.diagnosis}</span>.
                    </p>
                    <p className="text-[11px] text-neutral-400 leading-normal italic">
                      Outcome: &quot;{visit.outcome}&quot;
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Detailed SOAP Records */}
            {activeTab === "records" && (
              <div className="space-y-4">
                {patient.soapNotes.map((soap) => {
                  const isOpen = openSoapId === soap.id;
                  return (
                    <div
                      key={soap.id}
                      className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl overflow-hidden bg-neutral-50/20 dark:bg-neutral-850/5 shadow-soft-1"
                    >
                      <button
                        onClick={() => setOpenSoapId(isOpen ? null : soap.id)}
                        className="w-full px-5 py-4 flex items-center justify-between font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors focus-ring"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono font-bold">{soap.icd10}</span>
                          <span className="text-caption">{soap.date} — {soap.facility}</span>
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 border-t border-neutral-200/40 dark:border-neutral-800/40 space-y-4 text-caption leading-relaxed">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Dokter Penanggung Jawab</span>
                              <span className="text-[11px] text-neutral-700 dark:text-neutral-300 font-semibold">{soap.doctor}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Diagnosis ICD-10</span>
                              <span className="text-[11px] text-neutral-700 dark:text-neutral-300 font-semibold">{soap.assessment}</span>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                            <div>
                              <span className="text-[9px] font-bold text-neutral-450 text-label-caps">Subjective (Keluhan Pasien)</span>
                              <p className="text-caption text-neutral-600 dark:text-neutral-350 italic mt-0.5">&quot;{soap.subjective}&quot;</p>
                            </div>
                            
                            <div>
                              <span className="text-[9px] font-bold text-neutral-450 text-label-caps">Objective (Pemeriksaan Fisik / Vital)</span>
                              <p className="text-caption text-neutral-600 dark:text-neutral-350 mt-0.5">{soap.objective}</p>
                            </div>

                            <div>
                              <span className="text-[9px] font-bold text-neutral-450 text-label-caps">Assessment (Asesmen Klinis)</span>
                              <p className="text-caption text-neutral-600 dark:text-neutral-350 font-semibold mt-0.5">{soap.assessment}</p>
                            </div>

                            <div>
                              <span className="text-[9px] font-bold text-neutral-450 text-label-caps">Plan (Terapi & Rencana Rawat)</span>
                              <p className="text-caption text-neutral-600 dark:text-neutral-350 mt-0.5">{soap.plan}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: Lab Results */}
            {activeTab === "labs" && (
              <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-soft-1">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200/60 dark:border-neutral-800/40">
                        <th className="py-3 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Tanggal</th>
                        <th className="py-3 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Nama Tes</th>
                        <th className="py-3 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Hasil Nilai</th>
                        <th className="py-3 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Nilai Rujukan</th>
                        <th className="py-3 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.labResults.length > 0 ? (
                        patient.labResults.map((lab) => (
                          <tr key={lab.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-none">
                            <td className="py-3.5 px-4 text-caption text-neutral-600 dark:text-neutral-300 font-medium">{lab.date}</td>
                            <td className="py-3.5 px-4 text-caption text-neutral-850 dark:text-white font-semibold">{lab.testName}</td>
                            <td className={`py-3.5 px-4 text-caption font-mono font-semibold ${lab.isAbnormal ? "text-rose-500" : "text-neutral-800 dark:text-neutral-200"}`}>{lab.resultValue}</td>
                            <td className="py-3.5 px-4 text-caption text-neutral-500 font-mono">{lab.referenceRange}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex px-1.5 py-0.2 rounded text-[10px] font-bold ${lab.isAbnormal ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"}`}>
                                {lab.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-caption text-neutral-400 italic">
                            Belum ada rekam hasil lab terunggah.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Prescriptions */}
            {activeTab === "prescriptions" && (
              <div className="space-y-4">
                {patient.prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl p-5 bg-white dark:bg-neutral-900 shadow-soft-1 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
                      <div>
                        <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Tanggal Resep</span>
                        <p className="text-caption font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{rx.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rx.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-neutral-150 text-neutral-500 dark:bg-neutral-800"}`}>
                          {rx.status}
                        </span>
                        <Badge variant={rx.pharmacyStatus === "Selesai" ? "ACTIVE" : "PENDING"}>
                          Farmasi: {rx.pharmacyStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {rx.medications.map((m, mIdx) => (
                        <div key={mIdx} className="flex justify-between items-center text-caption font-medium">
                          <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-semibold">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span>{m.name} {m.dosage}</span>
                          </div>
                          <span className="text-neutral-500 font-mono text-[11px]">{m.frequency}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/60 text-[10px] text-neutral-400 mt-4 italic">
                      Diresepkan oleh Dr. Andi Wijaya
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Blockchain Audits */}
            {activeTab === "blockchain" && (
              <div className="space-y-4 font-mono text-[10px]">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl space-y-2 text-neutral-700 dark:text-neutral-350">
                  <div className="flex items-center gap-2 font-sans font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Audit Kepatuhan Kriptografik</span>
                  </div>
                  <p className="leading-relaxed">
                    Semua mutasi EMR secara immutable di-hash dan diverifikasi ke dalam blok konsensus Hyperledger Fabric. Hash lokal yang cocok membuktikan integritas rekam medis bebas manipulasi (anti-tamper).
                  </p>
                </div>

                <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-soft-1">
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 p-4 space-y-4">
                    {patient.blockchainLogs.map((log) => (
                      <div key={log.id} className="first:pt-0 pt-4 space-y-1.5">
                        <div className="flex justify-between items-center font-bold text-neutral-800 dark:text-neutral-200">
                          <span>BLOCK #{log.blockNumber} — {log.action}</span>
                          <span className="text-emerald-500">VERIFIED</span>
                        </div>
                        <div className="text-neutral-450 leading-none">Record SHA-256 Digest:</div>
                        <div className="text-neutral-600 dark:text-neutral-400 break-all bg-neutral-50 dark:bg-neutral-850 p-1.5 rounded">{log.recordHash}</div>
                        <div className="text-neutral-450 leading-none">Ledger Transaction Hash (Tx):</div>
                        <div className="text-neutral-600 dark:text-neutral-400 break-all bg-neutral-50 dark:bg-neutral-850 p-1.5 rounded">{log.transactionHash}</div>
                        <div className="text-[9px] text-neutral-400 flex justify-between items-center pt-1 font-sans">
                          <span>Operator: {log.signerName} ({log.signerRole})</span>
                          <span>Timestamp: {log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* QR Sharing Modal */}
      <Modal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        title="QR Code Identitas Medis Digital"
        description="Gunakan QR ini untuk mengidentifikasi berkas pasien di faskes mitra ObatIn."
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-soft-2 w-max select-none">
            <svg className="h-44 w-44 text-neutral-900" viewBox="0 0 100 100">
              <rect x="10" y="10" width="20" height="20" fill="currentColor" />
              <rect x="15" y="15" width="10" height="10" fill="white" />
              <rect x="70" y="10" width="20" height="20" fill="currentColor" />
              <rect x="75" y="15" width="10" height="10" fill="white" />
              <rect x="10" y="70" width="20" height="20" fill="currentColor" />
              <rect x="15" y="75" width="10" height="10" fill="white" />
              <rect x="40" y="20" width="10" height="10" fill="currentColor" />
              <rect x="50" y="40" width="10" height="15" fill="currentColor" />
              <rect x="35" y="55" width="15" height="10" fill="currentColor" />
              <rect x="70" y="50" width="15" height="10" fill="currentColor" />
              <rect x="80" y="80" width="10" height="10" fill="currentColor" />
              <rect x="55" y="75" width="10" height="15" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h4 className="text-caption font-semibold text-neutral-800 dark:text-neutral-200">
              {patient.name}
            </h4>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">NIK: {patient.nik}</p>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
