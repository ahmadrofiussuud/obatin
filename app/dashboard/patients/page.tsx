"use client";

import React, { useState, useMemo } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/shared/toast-provider";
import {
  Search,
  Eye,
  Edit2,
  QrCode,
  ChevronDown,
  ChevronUp,
  FileDown,
  Archive,
  Plus,
  Building,
  Activity,
  History,
} from "lucide-react";
import Link from "next/link";
import { MOCK_PATIENTS, MockPatient } from "@/lib/mock-data";

export default function PatientListPage() {
  const { toast } = useToast();
  
  // States
  const [patients, setPatients] = useState<MockPatient[]>(MOCK_PATIENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [facilityFilter, setFacilityFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Add Patient Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNik, setNewNik] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newGender, setNewGender] = useState<"MALE" | "FEMALE">("MALE");
  
  // QR Modal
  const [qrPatientName, setQrPatientName] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Filters logic
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.nik.includes(search);
      
      const matchStatus = statusFilter === "ALL" ? true : p.status === statusFilter;
      
      // Filter by faskes (mock)
      const matchFacility =
        facilityFilter === "ALL"
          ? true
          : p.visits.some((v) => v.facility.toLowerCase().includes(facilityFilter.toLowerCase()));

      return matchSearch && matchStatus && matchFacility;
    });
  }, [patients, search, statusFilter, facilityFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPatients.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPatients.map((p) => p.id)));
    }
  };

  const handleBulkExport = () => {
    if (selectedIds.size === 0) {
      toast({ title: "Tindakan Gagal", description: "Pilih pasien terlebih dahulu.", type: "warning" });
      return;
    }
    toast({
      title: "Ekspor Data Pasien",
      description: `Mengekspor ${selectedIds.size} berkas rekam medis ke CSV terenkripsi...`,
      type: "success",
    });
    setSelectedIds(new Set());
  };

  const handleBulkArchive = () => {
    if (selectedIds.size === 0) {
      toast({ title: "Tindakan Gagal", description: "Pilih pasien terlebih dahulu.", type: "warning" });
      return;
    }
    toast({
      title: "Arsipkan Pasien",
      description: `Berhasil mengarsipkan ${selectedIds.size} profil pasien dari portal aktif.`,
      type: "success",
    });
    setSelectedIds(new Set());
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNik.length !== 16) {
      toast({ title: "Validasi Gagal", description: "NIK harus 16 digit.", type: "warning" });
      return;
    }

    const age = newDob ? new Date().getFullYear() - new Date(newDob).getFullYear() : 30;

    const newPatient: MockPatient = {
      id: `P-00${patients.length + 1}`,
      name: newName,
      nik: newNik,
      bpjsNumber: `000${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      gender: newGender,
      dateOfBirth: newDob || "1995-01-01",
      placeOfBirth: "Jakarta",
      age,
      address: "Alamat baru faskes",
      phoneNumber: "081298765400",
      bloodType: "O",
      weight: 65,
      height: 168,
      bmi: 23.0,
      emergencyContact: {
        name: "Kontak Darurat",
        phone: "081298765411",
        relation: "Kerabat",
      },
      conditions: [],
      allergies: [],
      medications: [],
      lastVisit: "Belum pernah",
      status: "STABLE",
      attendingDoctor: "Dr. Sarah Siregar",
      visits: [],
      soapNotes: [],
      labResults: [],
      prescriptions: [],
      blockchainLogs: [],
    };

    setPatients((prev) => [newPatient, ...prev]);
    setIsAddOpen(false);
    setNewName("");
    setNewNik("");
    setNewDob("");
    toast({ title: "Registrasi Sukses", description: `${newName} berhasil didaftarkan ke faskes.`, type: "success" });
  };

  return (
    <AppShell>
      <PageHeader
        title={`Manajemen Berkas Pasien (${filteredPatients.length})`}
        description="Kelola data registrasi pasien faskes, bagikan kode QR identitas digital, ekspor rekam medis, dan review diagnosa triase."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Berkas Pasien" },
        ]}
        actions={
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Daftar Pasien
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan NIK, ID, atau nama pasien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
          >
            <option value="ALL">Semua Kondisi</option>
            <option value="ACTIVE">Active</option>
            <option value="CRITICAL">Critical</option>
            <option value="STABLE">Stable</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Facility Filter */}
          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
          >
            <option value="ALL">Semua Faskes</option>
            <option value="Pondok Indah">RS Pondok Indah</option>
            <option value="Medika Utama">Klinik Medika Utama</option>
          </select>

          {/* Bulk Actions Button */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-fade-in">
              <button
                onClick={handleBulkExport}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-caption font-semibold flex items-center gap-1.5 transition-all focus-ring cursor-pointer"
              >
                <FileDown className="h-4 w-4" />
                Ekspor ({selectedIds.size})
              </button>
              <button
                onClick={handleBulkArchive}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-caption font-semibold flex items-center gap-1.5 transition-all focus-ring cursor-pointer"
              >
                <Archive className="h-4 w-4" />
                Arsipkan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Expandable Table Frame */}
      <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-soft-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200/60 dark:border-neutral-800/40">
                <th className="py-3.5 px-6 w-10">
                  <input
                    type="checkbox"
                    checked={filteredPatients.length > 0 && selectedIds.size === filteredPatients.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                  />
                </th>
                <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Identitas Pasien</th>
                <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Usia / Tgl Lahir</th>
                <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Kunjungan Terakhir</th>
                <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Dokter Utama</th>
                <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Kondisi</th>
                <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 text-center uppercase tracking-wider">Tindakan</th>
              </tr>
            </thead>
            
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-caption text-neutral-400">
                    Tidak ada berkas pasien ditemukan.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => {
                  const isSelected = selectedIds.has(p.id);
                  const isExpanded = expandedId === p.id;
                  
                  return (
                    <React.Fragment key={p.id}>
                      {/* Standard Row */}
                      <tr
                        className={`border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors duration-150 ${
                          isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                      >
                        <td
                          className="py-4 px-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(p.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                          />
                        </td>
                        
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : p.id)}
                              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            <Avatar name={p.name} size="sm" />
                            <div>
                              <div className="text-caption font-semibold text-neutral-800 dark:text-neutral-200">{p.name}</div>
                              <div className="text-[10px] text-neutral-400 font-mono">{p.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-caption text-neutral-600 dark:text-neutral-300 font-medium">
                          {p.age} Tahun <br />
                          <span className="text-[10px] text-neutral-450">{p.dateOfBirth}</span>
                        </td>

                        <td className="py-4 px-4 text-caption text-neutral-600 dark:text-neutral-300 font-medium">
                          {p.lastVisit}
                        </td>

                        <td className="py-4 px-4 text-caption text-neutral-600 dark:text-neutral-300 font-medium">
                          {p.attendingDoctor}
                        </td>

                        <td className="py-4 px-4">
                          <Badge variant={p.status}>{p.status}</Badge>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/dashboard/patients/${p.id}`}>
                              <button className="p-1.5 text-neutral-400 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring cursor-pointer">
                                <Eye className="h-4 w-4" />
                              </button>
                            </Link>
                            
                            <button
                              onClick={() => toast({ title: "Edit Profil", description: `Membuka form editor untuk ${p.name}...`, type: "info" })}
                              className="p-1.5 text-neutral-400 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => {
                                setQrPatientName(p.name);
                                setIsQrOpen(true);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring cursor-pointer"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Preview Section */}
                      {isExpanded && (
                        <tr className="bg-neutral-50/40 dark:bg-neutral-850/20 border-b border-neutral-100 dark:border-neutral-800/60">
                          <td />
                          <td colSpan={6} className="p-5 text-caption">
                            {p.soapNotes.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse-subtle">
                                <div className="space-y-1">
                                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Activity className="h-3.5 w-3.5" />
                                    Keluhan (Subjective)
                                  </div>
                                  <p className="text-[11px] text-neutral-600 dark:text-neutral-350 leading-relaxed italic">
                                    &quot;{p.soapNotes[0].subjective}&quot;
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Building className="h-3.5 w-3.5" />
                                    Asesmen Medis
                                  </div>
                                  <p className="text-[11px] text-neutral-600 dark:text-neutral-350 leading-relaxed font-semibold">
                                    {p.soapNotes[0].assessment} <br />
                                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-mono font-bold mt-1 inline-block">
                                      ICD-10: {p.soapNotes[0].icd10}
                                    </span>
                                  </p>
                                </div>

                                <div className="space-y-1">
                                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <History className="h-3.5 w-3.5" />
                                    Ledger Audit Trail
                                  </div>
                                  <div className="text-[10px] font-mono text-neutral-400 leading-normal space-y-0.5">
                                    <div>BLOCK height: #{p.blockchainLogs[0]?.blockNumber || 15902}</div>
                                    <div className="truncate">TX: {p.blockchainLogs[0]?.transactionHash || "N/A"}</div>
                                    <div className="text-secondary font-semibold">STATUS: VERIFIED SECURED</div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] text-neutral-400 italic">
                                Belum ada riwayat rekam medis SOAP tertulis untuk faskes ini.
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code sharing Modal */}
      <Modal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        title="QR Code Identitas Medis Digital"
        description="Pindai QR ini pada booth administrasi rumah sakit untuk check-in instan."
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-soft-2 w-max select-none">
            {/* Elegant Vector QR code preview */}
            <svg className="h-44 w-44 text-neutral-900" viewBox="0 0 100 100">
              <rect x="10" y="10" width="20" height="20" fill="currentColor" />
              <rect x="15" y="15" width="10" height="10" fill="white" />
              <rect x="70" y="10" width="20" height="20" fill="currentColor" />
              <rect x="75" y="15" width="10" height="10" fill="white" />
              <rect x="10" y="70" width="20" height="20" fill="currentColor" />
              <rect x="15" y="75" width="10" height="10" fill="white" />
              {/* Random QR blocks */}
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
              {qrPatientName}
            </h4>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Identitas terenkripsi SATUSEHAT</p>
          </div>
          
          <button
            onClick={() => {
              setIsQrOpen(false);
              toast({ title: "Cetak QR", description: "Mengirim berkas cetak QR...", type: "success" });
            }}
            className="w-full py-2 bg-primary text-white hover:bg-primary-600 rounded-lg text-caption font-semibold shadow-premium-sm transition-all focus-ring cursor-pointer"
          >
            Cetak QR Pasien
          </button>
        </div>
      </Modal>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Daftarkan Pasien Baru faskes"
        description="Lakukan pendaftaran NIK dilingkungan sandbox BPJS Kemenkes."
      >
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Nama Lengkap (Sesuai KTP)
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Budi Santoso..."
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
            />
          </div>

          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              NIK (16 Digit KTP)
            </label>
            <input
              type="text"
              required
              maxLength={16}
              minLength={16}
              value={newNik}
              onChange={(e) => setNewNik(e.target.value)}
              placeholder="3171012345670001..."
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                required
                value={newDob}
                onChange={(e) => setNewDob(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as "MALE" | "FEMALE")}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
              >
                <option value="MALE">Laki-laki (Male)</option>
                <option value="FEMALE">Perempuan (Female)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/30">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg text-caption font-semibold transition-all focus-ring cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white hover:bg-primary-600 rounded-lg text-caption font-semibold shadow-premium-sm transition-all focus-ring cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

    </AppShell>
  );
}
