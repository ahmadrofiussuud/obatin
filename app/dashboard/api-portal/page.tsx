"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/shared/toast-provider";
import {
  Copy,
  Plus,
  Trash2,
  Lock,
  Cpu,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  usage: number;
  status: "Active" | "Revoked";
}

const MOCK_API_USAGE = [
  { date: "01/06", diagnosis: 120, patient: 240 },
  { date: "05/06", diagnosis: 150, patient: 300 },
  { date: "10/06", diagnosis: 180, patient: 380 },
  { date: "15/06", diagnosis: 240, patient: 420 },
  { date: "20/06", diagnosis: 310, patient: 500 },
  { date: "25/06", diagnosis: 380, patient: 610 },
  { date: "28/06", diagnosis: 420, patient: 680 },
];

export default function ApiPortalPage() {
  const { toast } = useToast();

  // Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key-1",
      name: "Integrasi RS Pondok Indah",
      key: "ma_live_90421893ea721c890f92",
      created: "2026-01-15",
      lastUsed: "28 Juni 2026",
      usage: 12450,
      status: "Active",
    },
    {
      id: "key-2",
      name: "Sandbox Mobile Patient App",
      key: "ma_test_1049283ba48e91c78e90",
      created: "2026-03-22",
      lastUsed: "27 Juni 2026",
      usage: 3410,
      status: "Active",
    },
  ]);

  // Generate Key Modal states
  const [isGenOpen, setIsGenOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["diagnosis"]);
  const [rateLimit, setRateLimit] = useState("Standard");

  // Code snippets tab state
  const [selectedLang, setSelectedLang] = useState<"curl" | "js" | "python">("curl");

  // Endpoint documentation list
  const endpoints = [
    { method: "POST", path: "/v1/diagnosis/analyze", desc: "Kirim gejala klinis & data vital untuk diagnosis diferensial AI.", status: "Active" },
    { method: "GET", path: "/v1/patients/{id}/emr", desc: "Retrieve riwayat rekam medis SOAP terverifikasi blockchain.", status: "Active" },
    { method: "POST", path: "/v1/blockchain/verify", desc: "Validasi SHA-256 local digest terhadap blockchain node Kemenkes.", status: "Beta" },
  ];

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Kunci Disalin", description: "API Key berhasil disalin ke clipboard.", type: "success" });
  };

  const handleRevokeKey = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin mencabut (revoke) kunci API ini? Aplikasi klien yang menggunakan kunci ini akan langsung kehilangan akses.")) {
      setApiKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: "Revoked" } : k))
      );
      toast({ title: "Kunci Dicabut", description: "API key berhasil dinonaktifkan.", type: "warning" });
    }
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      toast({ title: "Gagal", description: "Nama kunci API wajib diisi.", type: "warning" });
      return;
    }

    const newKey: ApiKey = {
      id: `key-${apiKeys.length + 1}`,
      name: keyName,
      key: `ma_${rateLimit === "Enterprise" ? "live" : "test"}_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Belum digunakan",
      usage: 0,
      status: "Active",
    };

    setApiKeys((prev) => [newKey, ...prev]);
    setIsGenOpen(false);
    setKeyName("");
    toast({ title: "Kunci Dibuat", description: `API key ${keyName} berhasil di-generate.`, type: "success" });
  };

  const handleScopeToggle = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  // Code snippets data
  const snippets = {
    curl: `curl -X POST https://api.mediai.id/v1/diagnosis/analyze \\
  -H "Authorization: Bearer ma_live_90421893ea721c890f92" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symptoms": ["s-1", "s-4"],
    "vitals": { "bp_sys": 120, "bp_dia": 80 }
  }'`,
    js: `const response = await fetch('https://api.mediai.id/v1/diagnosis/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ma_live_90421893ea721c890f92',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symptoms: ['s-1', 's-4'],
    vitals: { bp_sys: 120, bp_dia: 80 }
  })
});
const data = await response.json();`,
    python: `import requests

url = "https://api.mediai.id/v1/diagnosis/analyze"
headers = {
    "Authorization": "Bearer ma_live_90421893ea721c890f92",
    "Content-Type": "application/json"
}
payload = {
    "symptoms": ["s-1", "s-4"],
    "vitals": {"bp_sys": 120, "bp_dia": 80}
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()`,
  };

  return (
    <AppShell>
      <PageHeader
        title="Portal Developer & API B2B"
        description="Gunakan endpoint terstandarisasi untuk mengintegrasikan rekam medis faskes pihak ketiga dengan MediAI, dan kelola otorisasi credentials API Key."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Portal API" },
        ]}
        actions={
          <button
            onClick={() => setIsGenOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Generate New Key
          </button>
        }
      />

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Panggilan API (Bulan Ini)"
          value="15,860 Calls"
          change={14.8}
          changeLabel="vs bulan lalu"
          icon={Activity}
          sparklineData={[11200, 11900, 12500, 13400, 14200, 15100, 15860]}
        />
        <StatCard
          title="Tingkat Kesuksesan (Success Rate)"
          value="99.96%"
          change={0.02}
          changeLabel="vs 30 hari lalu"
          icon={Cpu}
          sparklineData={[99.94, 99.95, 99.94, 99.96, 99.95, 99.96, 99.96]}
        />
        <StatCard
          title="Rata-Rata Latensi"
          value="45 ms"
          change={-10.0}
          changeLabel="vs minggu lalu"
          icon={Activity}
          sparklineData={[52, 50, 48, 47, 46, 45, 45]}
        />
        
        {/* Rate limit status info card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 flex items-center justify-between">
          <div className="space-y-1.5 leading-none">
            <span className="text-[10px] text-neutral-450 font-semibold block uppercase">Status Rate Limit</span>
            <span className="text-caption font-semibold text-emerald-500 mt-1 inline-block">
              Normal (15% Kuota)
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
            <Lock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* MID ROW — API Key Table & Code Snippets split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* API Key management table (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 space-y-4">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Manajemen Kunci Kredensial API
            </h3>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Revoke atau ganti credentials yang bocor</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200/60 dark:border-neutral-800/40 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Nama Kunci</th>
                  <th className="py-2.5 px-3">Kunci Sensor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Tindakan</th>
                </tr>
              </thead>
              
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-none">
                    <td className="py-3 px-3 text-caption text-neutral-800 dark:text-neutral-200 font-semibold">{key.name}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <span>{key.key.substring(0, 12)}...</span>
                        <button
                          onClick={() => handleCopyKey(key.key)}
                          className="p-1 hover:bg-neutral-150 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={key.status === "Active" ? "ACTIVE" : "INACTIVE"}>
                        {key.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {key.status === "Active" && (
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors focus-ring cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Snippets panel (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 flex flex-col justify-between h-[310px]">
          <div>
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4 select-none">
              <div>
                <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Kode Contoh Integrasi
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Mocking API request client</p>
              </div>

              {/* Lang selectors */}
              <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5 bg-neutral-50 dark:bg-neutral-950 text-[10px] font-bold">
                <button
                  onClick={() => setSelectedLang("curl")}
                  className={`px-2 py-1 rounded transition-all ${
                    selectedLang === "curl" ? "bg-white dark:bg-neutral-800 text-primary shadow" : "text-neutral-500"
                  }`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setSelectedLang("js")}
                  className={`px-2 py-1 rounded transition-all ${
                    selectedLang === "js" ? "bg-white dark:bg-neutral-800 text-primary shadow" : "text-neutral-500"
                  }`}
                >
                  JS
                </button>
                <button
                  onClick={() => setSelectedLang("python")}
                  className={`px-2 py-1 rounded transition-all ${
                    selectedLang === "python" ? "bg-white dark:bg-neutral-800 text-primary shadow" : "text-neutral-500"
                  }`}
                >
                  Python
                </button>
              </div>
            </div>

            {/* Snippet box */}
            <div className="bg-neutral-950 dark:bg-black rounded-lg p-4 font-mono text-[10px] text-emerald-400 overflow-x-auto h-44 select-text">
              <pre>{snippets[selectedLang]}</pre>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW — API Usage Chart & Endpoint list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* API Usage Recharts line chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 flex flex-col justify-between h-[300px]">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
            <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Volume Lalu Lintas Panggilan API
            </h3>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Jumlah hit request 30 hari terakhir per modul endpoint</p>
          </div>

          <div className="flex-1 min-h-0 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_API_USAGE} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "hsl(var(--primary))", fontSize: "11px" }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "10px" }}
                />
                <Line type="monotone" dataKey="diagnosis" name="Diagnosis AI API" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="patient" name="Patient EMR API" stroke="hsl(var(--secondary))" strokeWidth={2} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Documentation list (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 flex flex-col justify-between h-[300px]">
          <div>
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Spesifikasi Endpoint API (Docs)
              </h3>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Spesifikasi format header request</p>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-850 overflow-y-auto max-h-[190px] pr-1">
              {endpoints.map((ep, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3 text-caption font-semibold">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold select-none ${
                    ep.method === "POST" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                  }`}>
                    {ep.method}
                  </span>
                  
                  <div className="space-y-0.5">
                    <div className="font-mono text-neutral-850 dark:text-white text-[11px]">{ep.path}</div>
                    <p className="text-[11px] text-neutral-500 leading-normal font-medium">{ep.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Generate API Key Modal */}
      <Modal
        isOpen={isGenOpen}
        onClose={() => setIsGenOpen(false)}
        title="Generate New Credentials API Key"
        description="Credentials baru akan di-hash menggunakan algoritma PBKDF2 di database faskes."
      >
        <form onSubmit={handleGenerateKey} className="space-y-4 text-caption font-semibold">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-350 mb-1">
              Nama Aplikasi Klien (Keterangan)
            </label>
            <input
              type="text"
              required
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Integrasi RSUP dr. Cipto Mangunkusumo..."
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-350 mb-1">
              Pilih Otorisasi Ruang Lingkup Scopes
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1 select-none">
              <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-850 p-2 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <input
                  type="checkbox"
                  checked={selectedScopes.includes("diagnosis")}
                  onChange={() => handleScopeToggle("diagnosis")}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <span>Diagnosis API</span>
              </label>

              <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-850 p-2 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <input
                  type="checkbox"
                  checked={selectedScopes.includes("emr")}
                  onChange={() => handleScopeToggle("emr")}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <span>Patient EMR API</span>
              </label>

              <label className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-850 p-2 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <input
                  type="checkbox"
                  checked={selectedScopes.includes("blockchain")}
                  onChange={() => handleScopeToggle("blockchain")}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <span>Blockchain API</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-350 mb-1">
              Pilih Limit Kuota Bandwidth
            </label>
            <select
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-300"
            >
              <option value="Standard">Standard Tier (60 requests/min)</option>
              <option value="Professional">Professional Tier (250 requests/min)</option>
              <option value="Enterprise">Enterprise Tier (Unlimited)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/30">
            <button
              type="button"
              onClick={() => setIsGenOpen(false)}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-350 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg text-caption font-semibold transition-all focus-ring cursor-pointer"
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
