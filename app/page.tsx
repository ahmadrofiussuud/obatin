"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  Shield,
  BarChart3,
  ClipboardList,
  HeartPulse,
  CheckCircle,
  XCircle,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Activity,
  CalendarDays,
  FileText,
  Play,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Tentang", href: "#tentang" },
];



const features = [
  {
    icon: Brain,
    title: "Asisten AI Klinis (MediBot)",
    desc: "AI menganalisis keluhan dan memberikan saran klinis awal berdasarkan riwayat medis pasien secara real-time.",
    bullets: ["Analisis gejala berbasis GPT-4 Turbo", "Rekomendasi diagnosis diferensial", "Deteksi interaksi obat otomatis"],
  },
  {
    icon: Shield,
    title: "Keamanan Hyperledger Blockchain",
    desc: "Setiap catatan rekam medis diamankan dengan audit trail blockchain yang tidak bisa dimanipulasi.",
    bullets: ["Enkripsi end-to-end seluruh data", "Audit trail tidak terhapus", "Verifikasi keaslian dokumen medis"],
  },
  {
    icon: ClipboardList,
    title: "Rekam Medis Elektronik (EMR)",
    desc: "Kelola rekam medis digital secara terstruktur dari anamnesis hingga resep dan rujukan.",
    bullets: ["Standar FHIR HL7 internasional", "Integrasi SATUSEHAT Kemenkes", "Ekspor & cetak otomatis"],
  },
  {
    icon: BarChart3,
    title: "Dashboard Analitik Klinik",
    desc: "Pantau performa klinik, tren kunjungan, dan indikator kesehatan melalui visualisasi data interaktif.",
    bullets: ["Laporan kunjungan harian & bulanan", "Heatmap beban dokter", "Statistik diagnosis terpopuler"],
  },
];

const steps = [
  {
    num: "01",
    title: "Daftar & Pilih Peran",
    desc: "Buat akun dalam 60 detik. Pilih peran Anda — Pasien, Dokter, atau Admin Klinik. Verifikasi identitas melalui NIK atau nomor STR tenaga medis.",
    mockup: (
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 space-y-4 border border-neutral-100">
        <p className="text-[11px] font-bold text-[#0DC6B8] uppercase tracking-widest">Pilih Peran</p>
        {["🏥 Saya Pasien", "🩺 Saya Dokter / Perawat", "⚙️ Admin Klinik"].map((r) => (
          <div key={r} className="px-4 py-3 rounded-xl border-2 border-neutral-100 hover:border-[#0DC6B8]/40 text-[13px] font-semibold text-neutral-700 cursor-pointer transition-all">{r}</div>
        ))}
      </div>
    ),
  },
  {
    num: "02",
    title: "Hubungkan Data Kesehatan",
    desc: "Pasien menghubungkan rekam medis dari berbagai faskes. Dokter mendaftar klinik dan mengatur jadwal konsultasi.",
    mockup: (
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 space-y-3 border border-neutral-100">
        <p className="text-[11px] font-bold text-[#0DC6B8] uppercase tracking-widest">Faskes Terkoneksi</p>
        {["RSUD Cipto Mangunkusumo", "Klinik Medika Utama", "RS Pondok Indah"].map((f, i) => (
          <div key={f} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-neutral-50">
            <div className="h-7 w-7 rounded-lg bg-[#0DC6B8]/15 flex items-center justify-center text-[#0DC6B8] font-bold text-[11px]">{i + 1}</div>
            <span className="text-[12px] font-medium text-neutral-700">{f}</span>
            <CheckCircle className="h-4 w-4 text-[#0DC6B8] ml-auto" />
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "03",
    title: "Kelola Layanan Medis",
    desc: "Buat janji temu, lihat antrean, catat rekam medis, konsultasi AI, dan pantau vitalitas — semua dalam satu platform.",
    mockup: (
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-5 space-y-3 border border-neutral-100">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-[#0DC6B8]" />
          <span className="text-[12px] font-bold text-neutral-800">MediBot AI</span>
        </div>
        <div className="bg-neutral-50 rounded-xl p-3 text-[11px] text-neutral-500 leading-relaxed">
          Berdasarkan riwayat pasien, tekanan darah 145/95 mmHg menunjukkan indikasi hipertensi stadium 1. Disarankan evaluasi oleh spesialis penyakit dalam.
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Diagnosa AI", "Risiko: Sedang", "ICD-10: I10"].map((t) => (
            <span key={t} className="text-[10px] font-bold bg-[#0DC6B8]/10 text-[#0DC6B8] px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>
    ),
  },
];

const avatarColors = ["bg-primary", "bg-secondary", "bg-violet-500", "bg-rose-400"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = ["beranda", "fitur", "cara-kerja", "tentang"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ background: "#EBF5FB" }}>

      {/* ══════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-[0_1px_12px_rgba(0,0,0,0.08)]" : "border-b border-neutral-100"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-[64px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <div className="h-8 w-8 rounded-lg bg-[#0D1F3C] flex items-center justify-center">
              <HeartPulse className="h-4.5 w-4.5 text-[#0DC6B8]" />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-[#0D1F3C]">
              Medi<span className="text-[#0DC6B8]">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors relative ${
                  activeSection === l.href.replace("#", "")
                    ? "text-[#0D1F3C] font-semibold"
                    : "text-neutral-500 hover:text-[#0D1F3C]"
                }`}
              >
                {l.label}
                {activeSection === l.href.replace("#", "") && (
                  <span className="absolute bottom-0.5 left-4 right-4 h-0.5 bg-[#0DC6B8] rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#0D1F3C] hover:bg-[#1a2f50] transition-colors shadow-sm"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-[#0DC6B8] border-2 border-[#0DC6B8] hover:bg-[#0DC6B8]/5 transition-colors"
            >
              Registrasi
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-neutral-100 px-6 pb-5 pt-2 shadow-lg">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="flex items-center py-3 text-[14px] font-medium text-neutral-700 border-b border-neutral-50 last:border-0">
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <Link href="/login" className="w-full py-3 text-center rounded-xl text-[14px] font-bold text-white bg-[#0D1F3C]">Masuk</Link>
              <Link href="/register" className="w-full py-3 text-center rounded-xl text-[14px] font-bold text-[#0DC6B8] border-2 border-[#0DC6B8]">Registrasi</Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section id="beranda" className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div className="space-y-6">
            <h1 className="text-[42px] md:text-[52px] lg:text-[58px] font-black leading-[1.1] text-[#0D1F3C] tracking-tight">
              Kelola Kesehatan <br />
              Lebih Cerdas dengan{" "}
              <span className="text-[#0DC6B8]">ObatIn</span>
            </h1>

            <p className="text-[16px] text-neutral-600 leading-relaxed max-w-lg">
              ObatIn membantu pasien, dokter, dan admin klinik mengelola rekam medis digital, antrean, dan konsultasi AI — terintegrasi SATUSEHAT Kemenkes RI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0D1F3C] hover:bg-[#1a2f50] text-white font-bold rounded-xl text-[15px] transition-all shadow-md">
                Mulai Sekarang
              </Link>
              <a href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-[#0DC6B8] text-[#0DC6B8] hover:bg-[#0DC6B8]/5 font-bold rounded-xl text-[15px] transition-all">
                <Play className="h-4 w-4 fill-[#0DC6B8]" />
                Lihat Cara Kerja
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {avatarColors.map((c, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                    {["BS", "SR", "AP", "DL"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#0D1F3C]">+500rb</p>
                <p className="text-[12px] text-neutral-500">Dipercaya oleh faskes di seluruh Indonesia</p>
              </div>
            </div>
          </div>

          {/* Right: Illustration + floating cards */}
          <div className="relative flex items-center justify-center">
            {/* Floating feature cards */}
            <div className="absolute -top-4 right-4 md:right-0 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center gap-2.5 border border-neutral-100 z-10 animate-float-slow">
              <Activity className="h-5 w-5 text-[#0DC6B8]" />
              <span className="text-[12px] font-semibold text-[#0D1F3C]">Vitalitas Real-time</span>
            </div>
            <div className="absolute top-[38%] -left-4 md:-left-8 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center gap-2.5 border border-neutral-100 z-10 animate-float-medium">
              <Brain className="h-5 w-5 text-[#0DC6B8]" />
              <span className="text-[12px] font-semibold text-[#0D1F3C]">MediBot AI</span>
            </div>
            <div className="absolute bottom-6 right-0 md:-right-4 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center gap-2.5 border border-neutral-100 z-10 animate-float-slow">
              <FileText className="h-5 w-5 text-[#0DC6B8]" />
              <span className="text-[12px] font-semibold text-[#0D1F3C]">Rekam Medis Digital</span>
            </div>
            <div className="absolute bottom-20 -left-2 md:-left-6 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center gap-2.5 border border-neutral-100 z-10 animate-float-medium">
              <CalendarDays className="h-5 w-5 text-[#0DC6B8]" />
              <span className="text-[12px] font-semibold text-[#0D1F3C]">Jadwal Dokter</span>
            </div>

            {/* Main illustration */}
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
              <Image
                src="/images/hero_illustration.png"
                alt="ObatIn Platform Illustration"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════ */}
      <section id="fitur" className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#0DC6B8]/15 text-[#0DC6B8] text-[11px] font-extrabold tracking-widest uppercase">
              Fitur Unggulan
            </span>
            <h2 className="text-[34px] md:text-[44px] font-black text-[#0D1F3C] leading-tight">
              Semua yang Dibutuhkan <br />
              untuk{" "}
              <span className="text-[#0DC6B8]">Administrasi Medis</span>
              <br />
              <span className="text-[#0DC6B8]">yang Lebih Baik</span>
            </h2>
            <p className="text-[15px] text-neutral-500 max-w-xl mx-auto leading-relaxed">
              ObatIn hadir dengan ekosistem fitur yang saling melengkapi — dari AI klinis, keamanan blockchain, hingga EMR terintegrasi SATUSEHAT.
            </p>
          </div>

          {/* Feature cards in big container */}
          <div className="bg-white rounded-3xl border-2 border-[#0DC6B8]/20 shadow-[0_8px_40px_rgba(13,198,184,0.08)] p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-[#0DC6B8]/10 flex items-center justify-center">
                      <f.icon className="h-5 w-5 text-[#0DC6B8]" />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#0D1F3C]">{f.title}</h3>
                  </div>
                  <p className="text-[14px] text-neutral-500 leading-relaxed">{f.desc}</p>
                  <ul className="space-y-1.5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] text-[#0DC6B8] font-medium">
                        <span className="mt-0.5 shrink-0">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section id="cara-kerja" className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-[34px] md:text-[44px] font-black text-[#0D1F3C] leading-tight">
              Bagaimana{" "}
              <span className="text-[#0DC6B8]">ObatIn</span>
              <br />
              Membantu Anda?
            </h2>
            <p className="text-[15px] text-neutral-500 max-w-xl mx-auto leading-relaxed">
              ObatIn dirancang untuk menyederhanakan alur kerja medis — dari pendaftaran pasien hingga penyimpanan rekam medis yang aman dan transparan.
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, idx) => (
              <div key={idx} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                {/* Text side */}
                <div className={`space-y-4 ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0DC6B8] flex items-center justify-center text-white font-black text-[13px]">
                      {idx + 1}
                    </div>
                    <span className="text-[11px] font-bold text-[#0DC6B8] uppercase tracking-widest">Langkah {step.num}</span>
                  </div>
                  <h3 className="text-[26px] md:text-[30px] font-black text-[#0D1F3C] leading-tight">{step.title}</h3>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">{step.desc}</p>
                  <a href="#" className="inline-flex items-center gap-1 text-[14px] font-bold text-[#0DC6B8] hover:gap-2 transition-all">
                    Pelajari selengkapnya <ChevronRight className="h-4 w-4" />
                  </a>
                </div>

                {/* Mockup side */}
                <div className={idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  {step.mockup}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT / WHY DIFFERENT
      ══════════════════════════════════════════════════ */}
      <section id="tentang" className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto space-y-20">

          {/* About intro */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#0DC6B8]/15 text-[#0DC6B8] text-[11px] font-extrabold tracking-widest uppercase">
                Tentang Kami
              </span>
              <h2 className="text-[36px] md:text-[44px] font-black text-[#0D1F3C] leading-tight">
                Mengubah Layanan Medis <br />
                Menjadi Lebih{" "}
                <span className="text-[#0DC6B8]">Transparan</span>
              </h2>
              <p className="text-[15px] text-neutral-500 leading-relaxed">
                ObatIn lahir dari sebuah visi: membebaskan pasien dan dokter Indonesia dari birokrasi rekam medis yang kaku dan tidak transparan, menggantinya dengan sistem digital berbasis AI dan blockchain yang adil, aman, dan mudah diakses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#0D1F3C] text-white font-bold rounded-xl text-[14px] hover:bg-[#1a2f50] transition-colors">
                  Gabung Sekarang
                </Link>
                <a href="#cara-kerja"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#0DC6B8] text-[#0DC6B8] font-bold rounded-xl text-[14px] hover:bg-[#0DC6B8]/5 transition-colors">
                  Bagaimana Cara Kerjanya <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "500+", label: "Faskes Terdaftar" },
                { val: "120K+", label: "Rekam Medis Terkelola" },
                { val: "99.9%", label: "Uptime SLA" },
                { val: "2.4s", label: "Waktu Respons AI" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-neutral-100">
                  <p className="text-[32px] font-black text-[#0DC6B8]">{s.val}</p>
                  <p className="text-[13px] font-semibold text-neutral-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison: Old vs New */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-[32px] md:text-[40px] font-black text-[#0D1F3C]">Mengapa Kami Berbeda?</h2>
              <p className="text-[15px] text-neutral-500 max-w-lg mx-auto leading-relaxed">
                Kami percaya rekam medis sejati bukan tentang menumpuk berkas, melainkan tentang aksesibilitas data yang tepat, aman, dan cepat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old way */}
              <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-neutral-100 space-y-5">
                <div className="h-11 w-11 rounded-xl bg-rose-50 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-rose-400" />
                </div>
                <h3 className="text-[20px] font-bold text-[#0D1F3C]">Sistem Konvensional</h3>
                <p className="text-[13px] text-neutral-400 leading-relaxed">Metode rekam medis kertas yang lambat, rentan rusak, dan tidak bisa diakses lintas faskes.</p>
                <ul className="space-y-2.5">
                  {[
                    "Berkas mudah hilang atau rusak",
                    "Tidak bisa diakses dari faskes lain",
                    "Rentan manipulasi dan pemalsuan",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-neutral-500">
                      <span className="text-rose-400 mt-0.5 shrink-0">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ObatIn */}
              <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(13,198,184,0.12)] border-2 border-[#0DC6B8]/25 space-y-5 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Sparkles className="h-5 w-5 text-[#0DC6B8]/30" />
                </div>
                <div className="h-11 w-11 rounded-xl bg-[#0DC6B8]/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-[#0DC6B8]" />
                </div>
                <h3 className="text-[20px] font-bold text-[#0DC6B8]">Platform ObatIn</h3>
                <p className="text-[13px] text-[#0DC6B8]/70 leading-relaxed">Rekam medis digital terdistribusi yang aman, transparan, dan dapat diakses kapan saja, di mana saja.</p>
                <ul className="space-y-2.5">
                  {[
                    "Rekam medis aman di blockchain Hyperledger",
                    "Bisa diakses lintas faskes dengan izin pasien",
                    "Riwayat tindakan tidak dapat dimanipulasi",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-[#0D1F3C] font-medium">
                      <span className="text-[#0DC6B8] mt-0.5 shrink-0">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-[36px] md:text-[48px] font-black text-[#0D1F3C] leading-tight">
            Siap Memulai Perjalanan <br />
            Kesehatan yang{" "}
            <span className="text-[#0DC6B8]">Lebih Cerdas?</span>
          </h2>
          <p className="text-[15px] text-neutral-500 leading-relaxed">
            Bergabung dengan ratusan faskes yang sudah menggunakan ObatIn. Daftar gratis hari ini — tidak perlu kartu kredit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0D1F3C] hover:bg-[#1a2f50] text-white font-bold rounded-xl text-[15px] transition-colors shadow-lg">
              Daftar Gratis Sekarang
            </Link>
            <Link href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#0DC6B8] text-[#0DC6B8] font-bold rounded-xl text-[15px] hover:bg-[#0DC6B8]/5 transition-colors">
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#0D1F3C] flex items-center justify-center">
              <HeartPulse className="h-3.5 w-3.5 text-[#0DC6B8]" />
            </div>
            <span className="text-[15px] font-extrabold text-[#0D1F3C]">
              Medi<span className="text-[#0DC6B8]">AI</span> Indonesia
            </span>
          </Link>
          <p className="text-[12px] text-neutral-400 text-center">
            © 2026 ObatIn Indonesia. Platform Administrasi Kesehatan Digital Berbasis AI &amp; Blockchain.
          </p>
          <div className="flex items-center gap-5">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-[12px] text-neutral-400 hover:text-[#0DC6B8] transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Floating animation styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
