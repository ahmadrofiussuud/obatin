"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/shared/toast-provider";
import {
  Send,
  Plus,
  Search,
  MessageCircle,
  Brain,
  Settings,
  HelpCircle,
  Stethoscope,
  Pill,
  Activity,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { MOCK_PATIENTS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  card?: { type: "diagnosis" | "interaction" | "risk"; title: string; details: any };
}

interface Session {
  id: string;
  label: string;
  preview: string;
}

// ─── Shared Data ─────────────────────────────────────────────────────────────

const INITIAL_SESSIONS: Session[] = [
  { id: "s1", label: "Kepala pusing pagi hari", preview: "Analisis gejala dan saran awal" },
  { id: "s2", label: "Interaksi Amlodipine", preview: "Cek interaksi dengan Simvastatin" },
  { id: "s3", label: "Tensi 140/90", preview: "Apakah perlu ke dokter?" },
];

const AI_SUGGESTIONS_PATIENT = [
  "Kepala saya sering pusing",
  "Tensi saya 140/90 mmHg",
  "Obat apa untuk demam?",
  "Cek interaksi obat saya",
];

const AI_SUGGESTIONS_CLINICIAN = [
  "Analisis lab kolesterol",
  "Cek interaksi Simvastatin",
  "Ringkas alergi obat",
  "Buat draft surat rujukan",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIAssistantPage() {
  const { toast } = useToast();
  const { user, role } = useAuth();
  const isPatient = role === "PATIENT";

  const [activeSession, setActiveSession] = useState("s1");
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentPatient = MOCK_PATIENTS.find((p) => p.id === selectedPatientId);

  const greeting = isPatient
    ? `Halo ${user?.name?.split(" ")[0] ?? ""}! Aku MediBot AI, asisten kesehatanmu. Ceritakan keluhan atau pertanyaan kesehatanmu hari ini, ya!`
    : "Halo Dokter! Pilih pasien dari panel kanan atau langsung ajukan pertanyaan klinis. Saya siap membantu analisis.";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "assistant",
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const suggestions = isPatient ? AI_SUGGESTIONS_PATIENT : AI_SUGGESTIONS_CLINICIAN;
  const filteredPatients = MOCK_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nik.includes(searchQuery)
  );

  const handleSend = (text?: string) => {
    const msg = text || inputText;
    if (!msg.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      sender: "user",
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((p) => [...p, userMsg]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      let aiText = "Terima kasih atas pertanyaannya. Berikut analisis awal saya.";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let card: ChatMessage["card"] | undefined;

      const t = msg.toLowerCase();
      if (t.includes("pusing") || t.includes("kepala") || t.includes("tensi")) {
        aiText = "Berdasarkan keluhan Anda, berikut analisis awal yang bisa saya berikan.";
        card = {
          type: "diagnosis",
          title: "Analisis Gejala",
          details: { condition: "Kemungkinan Hipertensi / Tension Headache", icd10: "I10", confidence: 72, evidence: ["Keluhan pusing dilaporkan", "Perlu cek tekanan darah", "Evaluasi pola tidur & stres"] },
        };
      } else if (t.includes("interaksi") || t.includes("simvastatin") || t.includes("amlodipine")) {
        aiText = "Saya menemukan informasi penting tentang kombinasi obat yang Anda tanyakan.";
        card = {
          type: "interaction",
          title: "Interaksi Obat",
          details: { drugA: "Amlodipine", drugB: "Simvastatin", severity: "Moderate", recommendation: "Batasi dosis Simvastatin maks 20mg/hari jika dikombinasikan dengan Amlodipine." },
        };
      } else if (t.includes("kolesterol") || t.includes("lab")) {
        aiText = "Berdasarkan profil lipid, berikut asesmen risiko kardiovaskularnya.";
        card = {
          type: "risk",
          title: "Risiko Kardiovaskular",
          details: { score: 65, factors: ["Kolesterol total tinggi (220 mg/dL)", "Usia 37 tahun", "Gaya hidup sedentary"], actions: ["Diet rendah lemak", "Evaluasi dosis statin", "Cek lipid 3 bulan lagi"] },
        };
      } else {
        aiText = isPatient
          ? "Keluhan Anda perlu evaluasi lebih lanjut. Disarankan konsultasi langsung ke dokter untuk pemeriksaan fisik."
          : "Pertanyaan klinis yang baik. Berdasarkan literatur terkini, berikut rekomendasi saya.";
      }

      setMessages((p) => [...p, {
        id: Math.random().toString(36).slice(2),
        sender: "assistant",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        card,
      }]);
      setLoading(false);
      toast({ title: "MediBot AI Merespons", description: "Analisis siap.", type: "success" });
    }, 1400);
  };

  const handleNewSession = () => {
    const newId = `s${Date.now()}`;
    setSessions((p) => [{ id: newId, label: "Sesi Baru", preview: "Chat kosong baru" }, ...p]);
    setActiveSession(newId);
    setMessages([{
      id: "m-new",
      sender: "assistant",
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ─── Card renderer ─────────────────────────────────────────────────────────
  function MsgCard({ card }: { card: NonNullable<ChatMessage["card"]> }) {
    return (
      <div className="mt-2 bg-white rounded-xl border border-neutral-200 p-4 space-y-2 text-[12px]">
        {card.type === "diagnosis" && (
          <>
            <div className="flex items-start justify-between">
              <p className="font-bold text-[#0D1F3C]">{card.details.condition}</p>
              <span className="shrink-0 text-[10px] font-bold bg-[#0DC6B8]/10 text-[#0DC6B8] px-2 py-0.5 rounded-full ml-2">ICD-10: {card.details.icd10}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Keyakinan AI</span><span className="font-bold text-[#0DC6B8]">{card.details.confidence}%</span>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0DC6B8] rounded-full" style={{ width: `${card.details.confidence}%` }} />
              </div>
            </div>
            <ul className="space-y-0.5 text-neutral-500">
              {card.details.evidence.map((e: string) => <li key={e} className="flex gap-1.5"><span className="text-[#0DC6B8]">•</span>{e}</li>)}
            </ul>
          </>
        )}
        {card.type === "interaction" && (
          <>
            <div className="flex items-start justify-between">
              <p className="font-bold text-[#0D1F3C]">{card.details.drugA} + {card.details.drugB}</p>
              <span className="shrink-0 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">{card.details.severity}</span>
            </div>
            <p className="text-neutral-500 leading-relaxed">{card.details.recommendation}</p>
          </>
        )}
        {card.type === "risk" && (
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-full border-[3px] border-[#0DC6B8] flex items-center justify-center font-black text-[#0DC6B8]">{card.details.score}%</div>
            <div className="space-y-1">
              {card.details.factors.map((f: string) => <p key={f} className="text-neutral-500 flex gap-1.5"><span className="text-[#0DC6B8]">•</span>{f}</p>)}
              {card.details.actions.map((a: string) => <p key={a} className="text-[#0D1F3C] font-medium flex gap-1.5"><span className="text-[#0DC6B8]">→</span>{a}</p>)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Patient sidebar items ─────────────────────────────────────────────────
  const patientSidebarModes = [
    { icon: Brain, label: "Analisis Gejala" },
    { icon: Pill, label: "Cek Interaksi Obat" },
    { icon: Activity, label: "Cek Vitalitas" },
    { icon: FileText, label: "Ringkas Rekam Medis" },
  ];

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <AppShell>
      <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "hidden", borderRadius: 18, border: "1px solid #E8EFF6", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", background: "#fff" }}>

        {/* ══ LEFT SIDEBAR ══════════════════════════════════════════════════ */}
        <aside style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #F0F4F8", background: "#fff" }}>
          
          {/* New chat button */}
          <div style={{ padding: "12px 12px", borderBottom: "1px solid #F0F4F8" }}>
            <button
              onClick={handleNewSession}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", background: "#0DC6B8", color: "#fff", fontWeight: 700, fontSize: 13, borderRadius: 12, border: "none", cursor: "pointer" }}
            >
              <Plus size={16} />
              {isPatient ? "Chat Baru" : "Diskusi Baru"}
            </button>
          </div>

          {/* Scroll area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Sesi section */}
            <div>
              <p style={{ padding: "6px 8px", fontSize: 11, fontWeight: 900, color: "#0D1F3C", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                {isPatient ? "Sesi Chat" : "Konsultasi"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {/* Search */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "1px solid #E8EFF6", borderRadius: 12, color: "#B0BCC8", cursor: "pointer" }}>
                  <Search size={14} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12 }}>Cari diskusi</span>
                </div>
                {/* New session */}
                <button
                  onClick={handleNewSession}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "2px solid #0DC6B8", borderRadius: 12, fontSize: 12, fontWeight: 700, background: "rgba(13,198,184,0.08)", color: "#0DC6B8", cursor: "pointer", textAlign: "left" }}
                >
                  <MessageCircle size={14} style={{ flexShrink: 0 }} />
                  {isPatient ? "Diskusi Baru" : "Konsultasi Baru"}
                </button>
                {/* Past sessions */}
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSession(s.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: activeSession === s.id ? "1px solid rgba(13,198,184,0.5)" : "1px solid #E8EFF6", borderRadius: 12, fontSize: 12, fontWeight: 500, background: activeSession === s.id ? "rgba(13,198,184,0.05)" : "transparent", color: activeSession === s.id ? "#0D1F3C" : "#6B7A8D", cursor: "pointer", textAlign: "left" }}
                  >
                    <MessageCircle size={14} style={{ flexShrink: 0, color: activeSession === s.id ? "#0DC6B8" : "#B0BCC8" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode / fitur section */}
            <div>
              <p style={{ padding: "6px 8px", fontSize: 11, fontWeight: 900, color: "#0D1F3C", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                {isPatient ? "Fitur" : "Mode Klinis"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {(isPatient ? patientSidebarModes : [
                  { icon: Stethoscope, label: "Diagnosa Diferensial" },
                  { icon: Pill, label: "Interaksi Obat" },
                  { icon: Activity, label: "Asesmen Risiko" },
                  { icon: FileText, label: "Draft Surat Rujukan" },
                ]).map((m, i) => (
                  <button
                    key={i}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid #E8EFF6", borderRadius: 12, fontSize: 12, fontWeight: 500, background: "transparent", color: "#6B7A8D", cursor: "pointer", textAlign: "left" }}
                    onClick={() => handleSend(m.label)}
                  >
                    <m.icon size={14} style={{ flexShrink: 0, color: "#B0BCC8" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom links */}
          <div style={{ borderTop: "1px solid #F0F4F8", padding: "8px" }}>
            {[
              { icon: HelpCircle, label: "Petunjuk" },
              { icon: Settings, label: "Pengaturan" },
            ].map((item) => (
              <button key={item.label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", fontSize: 12, fontWeight: 500, color: "#8A9BB0", background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left" }}>
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ══ CHAT AREA ════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#EBF5FB", minWidth: 0 }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div key={m.id} style={{ display: "flex", gap: 10, flexDirection: isUser ? "row-reverse" : "row", maxWidth: "78%", marginLeft: isUser ? "auto" : 0 }}>
                  {!isUser && (
                    <div style={{ height: 36, width: 36, flexShrink: 0, marginTop: 2, borderRadius: 999, background: "#0DC6B8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Brain size={16} color="#fff" />
                    </div>
                  )}
                  {isUser && (
                    <Avatar name={user?.name ?? "U"} size="sm" />
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ padding: "10px 14px", borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", fontSize: 13, lineHeight: 1.6, background: isUser ? "#0D1F3C" : "#fff", color: isUser ? "#fff" : "#1A2B3C", boxShadow: isUser ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}>
                      {m.text}
                    </div>
                    {m.card && !isUser && <MsgCard card={m.card} />}
                    <p style={{ fontSize: 10, color: "#B0BCC8", paddingLeft: 4, textAlign: isUser ? "right" : "left", margin: 0 }}>{m.timestamp}</p>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ height: 36, width: 36, flexShrink: 0, borderRadius: 999, background: "#0DC6B8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={16} color="#fff" />
                </div>
                <div style={{ padding: "10px 14px", background: "#fff", borderRadius: "4px 16px 16px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="h-2 w-2 bg-[#0DC6B8] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 bg-[#0DC6B8] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 bg-[#0DC6B8] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          {inputText.length === 0 && !loading && (
            <div style={{ padding: "0 24px 8px", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s)}
                  style={{ padding: "6px 14px", background: "#fff", border: "1px solid #E8EFF6", color: "#6B7A8D", fontSize: 11, fontWeight: 500, borderRadius: 99, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{ padding: "12px 24px 16px", background: "#fff", borderTop: "1px solid #F0F4F8" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button style={{ flexShrink: 0, padding: 10, color: "#0DC6B8", background: "transparent", border: "none", borderRadius: 12, cursor: "pointer" }}>
                <Plus size={16} />
              </button>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={isPatient ? "Tanyakan sesuatu pada MediBot AI..." : "Ajukan pertanyaan klinis..."}
                rows={1}
                style={{ flex: 1, padding: "10px 14px", border: "1px solid #E8EFF6", background: "#F8FAFC", borderRadius: 12, fontSize: 13, outline: "none", resize: "none", minHeight: 42, maxHeight: 112, color: "#1A2B3C", fontFamily: "inherit" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputText.trim()}
                style={{ flexShrink: 0, padding: 10, background: loading || !inputText.trim() ? "rgba(13,198,184,0.4)" : "#0DC6B8", color: "#fff", border: "none", borderRadius: 12, cursor: loading || !inputText.trim() ? "not-allowed" : "pointer" }}
              >
                <Send size={16} />
              </button>
            </div>
            <p style={{ fontSize: 10, color: "#B0BCC8", marginTop: 8, textAlign: "center" }}>
              {isPatient
                ? "AI MediBot hanya memberikan saran awal. Tetaplah kritis dan konsultasikan ke dokter berlisensi."
                : "Asisten AI bersifat decision support. Keputusan klinis final tanggung jawab dokter berlisensi."}
            </p>
          </div>
        </div>

        {/* ══ RIGHT PANEL: Clinician patient picker (non-patient only) ═══ */}
        {!isPatient && (
          <aside style={{ width: 224, flexShrink: 0, display: "flex", flexDirection: "column", borderLeft: "1px solid #F0F4F8", background: "#fff" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #F0F4F8" }}>
              <p style={{ fontSize: 11, fontWeight: 900, color: "#0D1F3C", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Pilih Pasien</p>
              <div style={{ position: "relative", marginTop: 8 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#B0BCC8" }} />
                <input type="text" placeholder="Cari nama / NIK..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "6px 12px 6px 32px", border: "1px solid #E8EFF6", borderRadius: 8, fontSize: 11, outline: "none", background: "#F8FAFC", color: "#1A2B3C" }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px", display: "flex", flexDirection: "column", gap: 4 }}>
              {filteredPatients.map((p) => (
                <button key={p.id}
                  onClick={() => setSelectedPatientId(p.id === selectedPatientId ? "" : p.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: selectedPatientId === p.id ? "1px solid rgba(13,198,184,0.5)" : "1px solid #E8EFF6", fontSize: 12, fontWeight: 500, textAlign: "left", cursor: "pointer", background: selectedPatientId === p.id ? "rgba(13,198,184,0.08)" : "transparent", color: selectedPatientId === p.id ? "#0D1F3C" : "#6B7A8D" }}>
                  <div style={{ height: 28, width: 28, flexShrink: 0, borderRadius: 999, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", fontWeight: 700, fontSize: 10 }}>
                    {p.name.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 700, color: "#0D1F3C", margin: "0 0 2px" }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: "#8A9BB0", margin: 0 }}>{p.id}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Patient detail if selected */}
            {currentPatient && (
              <div style={{ padding: "12px", borderTop: "1px solid #F0F4F8", background: "#F8FAFC", display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
                <p style={{ fontWeight: 900, color: "#0D1F3C", fontSize: 12, margin: 0 }}>{currentPatient.name}</p>
                <p style={{ color: "#8A9BB0", fontFamily: "monospace", margin: 0 }}>{currentPatient.nik}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {currentPatient.conditions.map((c) => (
                    <span key={c} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", background: "rgba(13,198,184,0.1)", color: "#0DC6B8", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                      <CheckCircle size={10} />{c}
                    </span>
                  ))}
                  {currentPatient.allergies.map((a) => (
                    <span key={a} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", background: "rgba(239,68,68,0.06)", color: "#EF4444", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                      <AlertCircle size={10} />{a}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPatientId("")}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", color: "#8A9BB0", fontSize: 11, background: "transparent", border: "none", cursor: "pointer", marginTop: 4 }}
                >
                  <Trash2 size={12} /> Hapus Pilihan
                </button>
              </div>
            )}

            {!currentPatient && (
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8 }}>
                <Users size={24} color="#E8EFF6" />
                <p style={{ fontSize: 11, color: "#B0BCC8", lineHeight: 1.6, margin: 0 }}>Pilih pasien untuk konteks konsultasi klinis</p>
              </div>
            )}
          </aside>
        )}
      </div>
    </AppShell>
  );
}
