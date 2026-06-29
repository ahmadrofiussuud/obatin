"use client";

import React from "react";
import { AppShell } from "@/components/shared/app-shell";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  CalendarDays,
  Brain,
  FileText,
  ChevronRight,
  Activity,
  Heart,
  Stethoscope,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Pill,
} from "lucide-react";

const recentActivity = [
  {
    icon: Stethoscope,
    title: "Konsultasi Dr. Andi Wijaya",
    sub: "Hipertensi Essensial (I10) · RSUD Cipto",
    time: "28 Jun 2026",
    iconBg: "#0DC6B8",
    iconBgAlpha: "rgba(13,198,184,0.1)",
  },
  {
    icon: Brain,
    title: "Sesi MediBot AI",
    sub: "Tanya keluhan pusing kepala pagi hari",
    time: "26 Jun 2026",
    iconBg: "#3B82F6",
    iconBgAlpha: "rgba(59,130,246,0.1)",
  },
  {
    icon: FileText,
    title: "Rekam Medis Diperbarui",
    sub: "Hasil Lab Kolesterol — Klinik Medika",
    time: "14 Mei 2026",
    iconBg: "#8B5CF6",
    iconBgAlpha: "rgba(139,92,246,0.1)",
  },
  {
    icon: CalendarDays,
    title: "Janji Temu Dijadwalkan",
    sub: "Dr. Pratama · RS Pondok Indah · 5 Jul",
    time: "Mendatang",
    iconBg: "#EF4444",
    iconBgAlpha: "rgba(239,68,68,0.08)",
  },
];

const healthMetrics = [
  { label: "Tekanan Darah", value: "120/80", unit: "mmHg", icon: Heart },
  { label: "Detak Jantung", value: "72", unit: "bpm", icon: Activity },
  { label: "Gula Darah", value: "95", unit: "mg/dL", icon: Pill },
  { label: "Berat Badan", value: "68", unit: "kg", icon: CheckCircle },
];

const recommendations = [
  {
    emoji: "💊",
    title: "Cek Interaksi Obat",
    desc: "Amlodipine & Simvastatin yang Anda konsumsi perlu dipantau secara berkala.",
  },
  {
    emoji: "📋",
    title: "Jadwal Lab Lipid",
    desc: "Evaluasi profil lipid disarankan setiap 3 bulan untuk pemantauan optimal.",
  },
  {
    emoji: "🩺",
    title: "Kontrol Rutin",
    desc: "Jadwalkan kontrol hipertensi ke dokter bulan depan.",
  },
];

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Pasien";

  return (
    <AppShell>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ── Greeting ────────────────────────────────────────────── */}
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0D1F3C", lineHeight: 1.25, margin: 0 }}>
            Halo <span style={{ color: "#0DC6B8" }}>{firstName}</span>!,{" "}
            butuh bantuan kesehatan apa hari ini?
          </h1>
        </div>

        {/* ── 3 Action Cards ─────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>

          {/* Buat Janji */}
          <div style={{ background: "#fff", borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #F0F4F8", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ height: 44, width: 44, borderRadius: 12, background: "rgba(13,198,184,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CalendarDays size={20} color="#0DC6B8" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#0D1F3C", margin: "0 0 4px" }}>Buat Janji Temu</p>
                <p style={{ fontSize: 12, color: "#8A9BB0", margin: 0, lineHeight: 1.5 }}>Daftarkan kunjungan ke dokter atau klinik terdekat.</p>
              </div>
            </div>
            <Link href="/dashboard/appointments" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", background: "#0D1F3C", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Buat Janji <ArrowRight size={14} />
            </Link>
          </div>

          {/* Tanya MediBot — highlighted */}
          <div style={{ background: "rgba(13,198,184,0.06)", borderRadius: 18, padding: "18px 20px", border: "2px solid rgba(13,198,184,0.25)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ height: 44, width: 44, borderRadius: 12, background: "rgba(13,198,184,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Brain size={20} color="#0DC6B8" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#0D1F3C", margin: "0 0 4px" }}>Tanya MediBot AI</p>
                <p style={{ fontSize: 12, color: "#8A9BB0", margin: 0, lineHeight: 1.5 }}>Ceritakan keluhan dan AI akan membantu analisis awal.</p>
              </div>
            </div>
            <Link href="/dashboard/ai-assistant" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", background: "#0DC6B8", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Mulai Chat <ArrowRight size={14} />
            </Link>
          </div>

          {/* Rekam Medis */}
          <div style={{ background: "#fff", borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #F0F4F8", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ height: 44, width: 44, borderRadius: 12, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={20} color="#3B82F6" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#0D1F3C", margin: "0 0 4px" }}>Rekam Medis</p>
                <p style={{ fontSize: 12, color: "#8A9BB0", margin: 0, lineHeight: 1.5 }}>Lihat riwayat kunjungan dan hasil pemeriksaan Anda.</p>
              </div>
            </div>
            <Link href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", background: "#0D1F3C", color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Lihat Rekam Medis <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Main 2-col ─────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14 }}>

          {/* Aktivitas Terbaru */}
          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #F0F4F8", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F0F4F8" }}>
              <p style={{ fontWeight: 900, fontSize: 16, color: "#0D1F3C", margin: 0 }}>Aktivitas Terbaru</p>
              <Link href="#" style={{ fontSize: 12, fontWeight: 700, color: "#0DC6B8", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Lihat semua <ChevronRight size={14} />
              </Link>
            </div>
            <div>
              {recentActivity.map((act, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < recentActivity.length - 1 ? "1px solid #F8FAFC" : "none", cursor: "pointer" }}>
                  <div style={{ height: 38, width: 38, borderRadius: 10, background: act.iconBgAlpha, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <act.icon size={16} color={act.iconBg} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0D1F3C", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{act.title}</p>
                    <p style={{ fontSize: 11, color: "#8A9BB0", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{act.sub}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <Clock size={11} color="#B0BCC8" />
                    <span style={{ fontSize: 11, color: "#B0BCC8" }}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitalitas */}
          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #F0F4F8", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F0F4F8" }}>
              <p style={{ fontWeight: 900, fontSize: 15, color: "#0D1F3C", margin: 0 }}>Vitalitas Saya</p>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#0DC6B8", background: "rgba(13,198,184,0.1)", padding: "2px 8px", borderRadius: 99 }}>28 Jun</span>
            </div>
            {/* Circle */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0 16px", borderBottom: "1px solid #F0F4F8" }}>
              <div style={{ position: "relative", width: 96, height: 96 }}>
                <svg viewBox="0 0 100 100" width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#EBF5FB" strokeWidth="9" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0DC6B8" strokeWidth="9"
                    strokeDasharray={`${0.85 * 251.2} 251.2`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#0DC6B8", lineHeight: 1 }}>85%</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#8A9BB0", textTransform: "uppercase" }}>Sehat</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#8A9BB0", marginTop: 8 }}>Skor Kesehatan Keseluruhan</p>
            </div>
            {/* Metrics 2x2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {healthMetrics.map((m, i) => (
                <div key={i} style={{ padding: "12px 14px", borderRight: i % 2 === 0 ? "1px solid #F0F4F8" : "none", borderBottom: i < 2 ? "1px solid #F0F4F8" : "none" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#B0BCC8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{m.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "#0D1F3C", lineHeight: 1, margin: "0 0 2px" }}>{m.value}</p>
                  <p style={{ fontSize: 10, color: "#B0BCC8", margin: 0 }}>{m.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Rekomendasi ─────────────────────────────────────────── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontWeight: 900, fontSize: 18, color: "#0D1F3C", margin: 0 }}>Rekomendasi Untukmu</p>
            <Link href="#" style={{ fontSize: 12, fontWeight: 700, color: "#0DC6B8", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Lihat semua <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {recommendations.map((r, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #F0F4F8", cursor: "pointer", transition: "box-shadow 0.2s" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{r.emoji}</div>
                <p style={{ fontWeight: 800, fontSize: 14, color: "#0D1F3C", margin: "0 0 6px" }}>{r.title}</p>
                <p style={{ fontSize: 12, color: "#8A9BB0", lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Kondisi & Alergi ─────────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #F0F4F8" }}>
          <p style={{ fontWeight: 900, fontSize: 15, color: "#0D1F3C", margin: "0 0 14px" }}>Kondisi &amp; Alergi Terdaftar</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Hipertensi Essensial (I10)", "Dislipidemia"].map((c) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(13,198,184,0.08)", color: "#0D1F3C", fontSize: 12, fontWeight: 700, borderRadius: 99, border: "1px solid rgba(13,198,184,0.2)" }}>
                <CheckCircle size={13} color="#0DC6B8" /> {c}
              </span>
            ))}
            <span style={{ width: 1, height: 28, background: "#E8EFF6", alignSelf: "center", margin: "0 4px" }} />
            {["Penisilin", "Sulfonamida"].map((a) => (
              <span key={a} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(239,68,68,0.06)", color: "#DC2626", fontSize: 12, fontWeight: 700, borderRadius: 99, border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertCircle size={13} color="#DC2626" /> Alergi: {a}
              </span>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
