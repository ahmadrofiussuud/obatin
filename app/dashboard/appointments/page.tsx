"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/shared/toast-provider";
import {
  CalendarDays,
  List,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { MOCK_PATIENTS } from "@/lib/mock-data";

interface MockAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  doctorSpecialty: string;
  type: "Konsultasi" | "Pemeriksaan Lab" | "Telemedicine" | "Tindakan Bedah";
  date: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  time: string; // e.g. "09:00"
  duration: string; // e.g. "30m"
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "CRITICAL" | "STABLE";
}

export default function AppointmentPage() {
  const { toast } = useToast();
  
  // Views toggle state
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedMobileDay, setSelectedMobileDay] = useState<"Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat">("Senin");
  
  // Quick book modal
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [bookPatientId, setBookPatientId] = useState("");
  const [bookDoctor, setBookDoctor] = useState("Dr. Andi Wijaya");
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("09:00");
  const [bookType, setBookType] = useState<"Konsultasi" | "Pemeriksaan Lab" | "Telemedicine" | "Tindakan Bedah">("Konsultasi");
  const [bookNotes, setBookNotes] = useState("");

  // Initial Appointments mock dataset
  const [appointments, setAppointments] = useState<MockAppointment[]>([
    {
      id: "apt-1",
      patientId: "P-001",
      patientName: "Budi Santoso",
      doctorName: "Dr. Andi Wijaya",
      doctorSpecialty: "Penyakit Dalam",
      type: "Konsultasi",
      date: "2026-06-29",
      day: "Senin",
      time: "09:00",
      duration: "30m",
      status: "CRITICAL",
    },
    {
      id: "apt-2",
      patientId: "P-002",
      patientName: "Siti Rahmawati",
      doctorName: "Dr. Sarah Siregar",
      doctorSpecialty: "Umum",
      type: "Telemedicine",
      date: "2026-06-29",
      day: "Senin",
      time: "10:30",
      duration: "15m",
      status: "PENDING",
    },
    {
      id: "apt-3",
      patientId: "P-003",
      patientName: "Aditya Pratama",
      doctorName: "Dr. Andi Wijaya",
      doctorSpecialty: "Penyakit Dalam",
      type: "Konsultasi",
      date: "2026-06-30",
      day: "Selasa",
      time: "09:00",
      duration: "30m",
      status: "ACTIVE",
    },
    {
      id: "apt-4",
      patientId: "P-004",
      patientName: "Dewi Lestari",
      doctorName: "Dr. Sarah Siregar",
      doctorSpecialty: "Umum",
      type: "Pemeriksaan Lab",
      date: "2026-07-01",
      day: "Rabu",
      time: "11:00",
      duration: "45m",
      status: "STABLE",
    },
    {
      id: "apt-5",
      patientId: "P-001",
      patientName: "Budi Santoso",
      doctorName: "Dr. Pratama Hardi",
      doctorSpecialty: "Kardiologi",
      type: "Tindakan Bedah",
      date: "2026-07-02",
      day: "Kamis",
      time: "14:00",
      duration: "60m",
      status: "ACTIVE",
    },
  ]);

  const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  const handleTelemedicine = (patientName: string) => {
    toast({
      title: "Telemedicine Aktif",
      description: `Menyambungkan sesi konferensi video dengan ${patientName}...`,
      type: "success",
    });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookPatientId) {
      toast({ title: "Validasi Gagal", description: "Silakan pilih pasien.", type: "warning" });
      return;
    }

    const patient = MOCK_PATIENTS.find((p) => p.id === bookPatientId);
    const patientName = patient ? patient.name : "Pasien Baru";

    // Determine day from date (mocked to Senin for simplicity)
    const newApt: MockAppointment = {
      id: `apt-${appointments.length + 1}`,
      patientId: bookPatientId,
      patientName,
      doctorName: bookDoctor,
      doctorSpecialty: bookDoctor.includes("Andi") ? "Penyakit Dalam" : "Umum",
      type: bookType,
      date: bookDate || "2026-06-29",
      day: "Senin",
      time: bookTime,
      duration: "30m",
      status: "ACTIVE",
    };

    setAppointments((prev) => [...prev, newApt]);
    setIsBookOpen(false);
    setBookNotes("");
    toast({ title: "Pemesanan Sukses", description: `Janji temu ${patientName} berhasil dibuat.`, type: "success" });
  };

  return (
    <AppShell>
      <PageHeader
        title="Jadwal Janji Temu"
        description="Kelola antrean reservasi medis dokter, koordinasikan layanan video konsultasi jarak jauh (telemedicine), dan atur kapasitas poli faskes."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Janji Temu" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {/* View togglers */}
            <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5 bg-white dark:bg-neutral-900 select-none">
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-md transition-all focus:outline-none ${
                  viewMode === "calendar"
                    ? "bg-neutral-100 dark:bg-neutral-800 text-primary"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                }`}
              >
                <CalendarDays className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all focus:outline-none ${
                  viewMode === "list"
                    ? "bg-neutral-100 dark:bg-neutral-800 text-primary"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setIsBookOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Atur Janji Temu
            </button>
          </div>
        }
      />

      {/* CALENDAR WEEKLY VIEW */}
      {viewMode === "calendar" && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl overflow-hidden shadow-soft-1">
          {/* Calendar Header Date selectors */}
          <div className="flex justify-between items-center p-4 border-b border-neutral-200/50 dark:border-neutral-800/30">
            <h3 className="text-heading-sm font-semibold text-neutral-850 dark:text-white flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-neutral-400" />
              Jadwal Poli Mingguan (29 Jun - 3 Jul 2026)
            </h3>
            
            <div className="flex items-center gap-2 select-none">
              <button className="p-1 border border-neutral-200 dark:border-neutral-850 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <ChevronLeft className="h-4 w-4 text-neutral-400" />
              </button>
              <span className="text-caption font-semibold text-neutral-600 dark:text-neutral-300">Minggu Ini</span>
              <button className="p-1 border border-neutral-200 dark:border-neutral-850 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Calendar Grid columns - Desktop (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-5 border-b border-neutral-200/40 dark:border-neutral-800/40 bg-neutral-50/50 dark:bg-neutral-800/10 text-center text-caption font-bold text-neutral-500 py-3 uppercase tracking-wider select-none">
            {daysList.map((day) => (
              <div key={day} className="border-r border-neutral-200/40 dark:border-neutral-800/20 last:border-none">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day selector tabs - Mobile (hidden on desktop) */}
          <div className="flex md:hidden border-b border-neutral-200/40 dark:border-neutral-800/40 bg-neutral-50/50 dark:bg-neutral-800/10 p-2 overflow-x-auto gap-2 select-none">
            {daysList.map((day) => {
              const isSelected = selectedMobileDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedMobileDay(day)}
                  className={`px-4 py-1.5 rounded-lg text-caption font-bold transition-all flex-shrink-0 ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-neutral-800 text-neutral-500 hover:text-neutral-750"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time Slots rows - Desktop View */}
          <div className="hidden md:grid grid-cols-5 divide-x divide-neutral-200/50 dark:divide-neutral-800/20 min-h-[480px]">
            {daysList.map((day) => {
              const dayAppointments = appointments.filter((apt) => apt.day === day);
              return (
                <div key={day} className="p-3 space-y-3 bg-white dark:bg-neutral-900 min-h-[480px] relative">
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map((apt) => {
                      const isDoctorAndi = apt.doctorName.includes("Andi");
                      return (
                        <div
                          key={apt.id}
                          className={`p-3.5 rounded-xl border space-y-2.5 shadow-soft-1 text-caption hover:scale-[1.01] transition-all cursor-pointer ${
                            isDoctorAndi
                              ? "bg-primary-50/80 border-primary-200/40 text-primary dark:bg-primary-950/20 dark:border-primary-900/30"
                              : "bg-secondary-50/80 border-secondary-200/40 text-secondary dark:bg-secondary-950/20 dark:border-secondary-900/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-wider font-mono flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {apt.time} ({apt.duration})
                            </span>
                            <Badge variant={apt.status}>{apt.status}</Badge>
                          </div>
                          
                          <div className="space-y-0.5 leading-none">
                            <div className="font-semibold text-neutral-850 dark:text-white truncate">
                              {apt.patientName}
                            </div>
                            <div className="text-[10px] text-neutral-450 truncate">
                              {apt.doctorName}
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-neutral-200/40 dark:border-neutral-850 pt-2 text-[10px]">
                            <span className="font-semibold uppercase tracking-wider">{apt.type}</span>
                            {apt.type === "Telemedicine" && (
                              <button
                                onClick={() => handleTelemedicine(apt.patientName)}
                                className="p-1 rounded bg-secondary text-white hover:bg-secondary-600 transition-colors focus-ring"
                              >
                                <Video className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-[10px] text-neutral-450 italic pointer-events-none select-none">
                      Tidak ada janji
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Slots rows - Mobile View */}
          <div className="grid grid-cols-1 md:hidden p-4 min-h-[300px] bg-white dark:bg-neutral-900">
            {(() => {
              const dayAppointments = appointments.filter((apt) => apt.day === selectedMobileDay);
              if (dayAppointments.length > 0) {
                return (
                  <div className="space-y-3">
                    {dayAppointments.map((apt) => {
                      const isDoctorAndi = apt.doctorName.includes("Andi");
                      return (
                        <div
                          key={apt.id}
                          className={`p-4 rounded-xl border space-y-3 shadow-soft-1 text-caption hover:scale-[1.01] transition-all cursor-pointer ${
                            isDoctorAndi
                              ? "bg-primary-50/80 border-primary-200/40 text-primary dark:bg-primary-950/20 dark:border-primary-900/30"
                              : "bg-secondary-50/80 border-secondary-200/40 text-secondary dark:bg-secondary-950/20 dark:border-secondary-900/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-wider font-mono flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {apt.time} ({apt.duration})
                            </span>
                            <Badge variant={apt.status}>{apt.status}</Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-caption font-bold text-neutral-900 dark:text-white">
                              {apt.patientName}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              Dokter: {apt.doctorName} ({apt.doctorSpecialty})
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-neutral-200/40 dark:border-neutral-850 pt-2 text-[10px]">
                            <span className="font-semibold uppercase tracking-wider">{apt.type}</span>
                            {apt.type === "Telemedicine" && (
                              <button
                                onClick={() => handleTelemedicine(apt.patientName)}
                                className="p-1 rounded bg-secondary text-white hover:bg-secondary-600 transition-colors focus-ring"
                              >
                                <Video className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              return (
                <div className="flex items-center justify-center py-16 text-center text-caption text-neutral-450 italic">
                  Tidak ada janji pada hari {selectedMobileDay}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {viewMode === "list" && (
        <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-soft-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200/60 dark:border-neutral-800/40">
                  <th className="py-3.5 px-6 text-caption font-bold text-neutral-500 uppercase tracking-wider">Identitas Pasien</th>
                  <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Dokter Pemeriksa</th>
                  <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Jadwal & Waktu</th>
                  <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Tipe Layanan</th>
                  <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider">Status Triase</th>
                  <th className="py-3.5 px-4 text-caption font-bold text-neutral-500 text-center uppercase tracking-wider">Telemedicine</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-none">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={apt.patientName} size="sm" />
                        <div>
                          <div className="text-caption font-semibold text-neutral-800 dark:text-neutral-200">{apt.patientName}</div>
                          <div className="text-[10px] text-neutral-450 font-mono">{apt.patientId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-caption text-neutral-600 dark:text-neutral-300 font-medium">
                      {apt.doctorName} <br />
                      <span className="text-[10px] text-neutral-450">{apt.doctorSpecialty}</span>
                    </td>

                    <td className="py-4 px-4 text-caption text-neutral-600 dark:text-neutral-300 font-medium">
                      {apt.date} — {apt.day} <br />
                      <span className="text-[10px] text-neutral-450 font-mono font-bold">{apt.time} ({apt.duration})</span>
                    </td>

                    <td className="py-4 px-4 text-caption font-semibold text-neutral-850 dark:text-white uppercase tracking-wider">
                      {apt.type}
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant={apt.status}>{apt.status}</Badge>
                    </td>

                    <td className="py-4 px-4 text-center">
                      {apt.type === "Telemedicine" ? (
                        <button
                          onClick={() => handleTelemedicine(apt.patientName)}
                          className="px-3 py-1.5 bg-secondary text-white hover:bg-secondary-600 rounded-lg text-caption font-semibold flex items-center gap-1.5 mx-auto transition-all focus-ring cursor-pointer"
                        >
                          <Video className="h-4 w-4" />
                          Hubungkan Video
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">Offline</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookOpen}
        onClose={() => setIsBookOpen(false)}
        title="Atur Jadwal Janji Temu Baru"
        description="Jadwalkan konsultasi rawat jalan, lab, telemedicine, atau tindakan bedah untuk pasien terdaftar."
      >
        <form onSubmit={handleBookAppointment} className="space-y-4">
          
          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Pilih Pasien Terdaftar
            </label>
            <select
              required
              value={bookPatientId}
              onChange={(e) => setBookPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
            >
              <option value="">-- Pilih Pasien --</option>
              {MOCK_PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.nik})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Dokter Spesialis Utama
            </label>
            <select
              value={bookDoctor}
              onChange={(e) => setBookDoctor(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
            >
              <option value="Dr. Andi Wijaya">Dr. Andi Wijaya (Penyakit Dalam)</option>
              <option value="Dr. Sarah Siregar">Dr. Sarah Siregar (Umum)</option>
              <option value="Dr. Pratama Hardi">Dr. Pratama Hardi (Kardiologi)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Tanggal Janji Temu
              </label>
              <input
                type="date"
                required
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Waktu Kedatangan
              </label>
              <select
                value={bookTime}
                onChange={(e) => setBookTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} WIB
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Tipe Layanan Medis
            </label>
            <select
              value={bookType}
              onChange={(e) => setBookType(e.target.value as "Konsultasi" | "Pemeriksaan Lab" | "Telemedicine" | "Tindakan Bedah")}
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300 font-semibold"
            >
              <option value="Konsultasi">Konsultasi Tatap Muka</option>
              <option value="Pemeriksaan Lab">Pemeriksaan Lab Rutin</option>
              <option value="Telemedicine">Telemedicine Jarak Jauh</option>
              <option value="Tindakan Bedah">Tindakan Bedah Khusus</option>
            </select>
          </div>

          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Catatan Keluhan Awal
            </label>
            <textarea
              value={bookNotes}
              onChange={(e) => setBookNotes(e.target.value)}
              placeholder="Tulis keluhan singkat..."
              className="w-full h-16 px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/30">
            <button
              type="button"
              onClick={() => setIsBookOpen(false)}
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
