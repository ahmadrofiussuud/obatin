"use client";

import React from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/shared/toast-provider";
import {
  Users,
  Calendar,
  FileDigit,
  Activity,
  ArrowRight,
  TrendingUp,
  Link2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  MOCK_VISIT_HISTORY,
  MOCK_STATUS_BREAKDOWN,
  MOCK_DOCTOR_WORKLOAD,
  MOCK_ACTIVITIES,
  MOCK_PATIENTS,
} from "@/lib/mock-data";

export default function MainDashboardPage() {
  const { toast } = useToast();
  const { role } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (role === "PATIENT") {
      router.push("/dashboard/patient");
    } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.push("/dashboard/admin");
    }
  }, [role, router]);

  const appointments = MOCK_PATIENTS.slice(0, 4);

  const handleAction = (patientName: string) => {
    toast({
      title: "Check-In Pasien",
      description: `${patientName} berhasil di-checkin untuk pelayanan hari ini.`,
      type: "success",
    });
  };

  // Status breakdown calculations
  const totalVisits = MOCK_VISIT_HISTORY.reduce((sum, item) => sum + item.count, 0);

  return (
    <AppShell>
      <PageHeader
        title="Pusat Kendali Administrasi"
        description="Pantau statistik pelayanan medis faskes, validasi audit trail ledger Hyperledger Fabric, dan atur ketersediaan operasional faskes."
        breadcrumbs={[{ label: "Portal Utama" }]}
      />

      {/* TOP ROW — 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Pasien Terdaftar"
          value="1,240 Pasien"
          change={12.4}
          changeLabel="vs bulan lalu"
          icon={Users}
          sparklineData={[1080, 1120, 1140, 1190, 1220, 1230, 1240]}
        />
        <StatCard
          title="Antrean Janji Temu Hari Ini"
          value="18 Janji"
          change={5.2}
          changeLabel="vs kemarin"
          icon={Calendar}
          sparklineData={[10, 12, 14, 11, 15, 17, 18]}
        />
        <StatCard
          title="Hasil Lab Tertunda"
          value="8 Hasil"
          change={-20.0}
          changeLabel="vs minggu lalu"
          icon={FileDigit}
          sparklineData={[15, 14, 12, 11, 10, 9, 8]}
        />
        <StatCard
          title="Uptime Node Blockchain"
          value="99.8%"
          change={0.1}
          changeLabel="vs 30 hari lalu"
          icon={Activity}
          sparklineData={[99.7, 99.7, 99.8, 99.8, 99.7, 99.8, 99.8]}
        />
      </div>

      {/* SECOND ROW — Charts (Visits left, Status donut right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Patient Visits AreaChart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 flex flex-col justify-between h-[340px]">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
            <div>
              <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Volume Kunjungan Pasien
              </h3>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">30 Hari terakhir (Total: {totalVisits} kunjungan)</p>
            </div>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.4%
            </span>
          </div>

          <div className="flex-1 min-h-0 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_VISIT_HISTORY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Kunjungan"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 flex flex-col justify-between h-[340px]">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
            <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Kondisi Aktif Pasien
            </h3>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Persentase status triase rawat faskes</p>
          </div>

          <div className="flex-1 flex items-center justify-center gap-6 min-h-0">
            <div className="h-40 w-40 flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_STATUS_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {MOCK_STATUS_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner details */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none leading-none space-y-0.5">
                <span className="text-caption text-neutral-400 font-medium">Total</span>
                <span className="text-heading-md font-semibold text-neutral-850 dark:text-white">100%</span>
              </div>
            </div>

            {/* Labels legends list */}
            <div className="flex-grow space-y-2">
              {MOCK_STATUS_BREAKDOWN.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-caption font-semibold">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-neutral-800 dark:text-neutral-200">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* THIRD ROW — Appointment List & Timeline Activity (5 cols left, 7 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Compact Appointment List (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              <div>
                <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Antrean Konsultasi Hari Ini
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Check-in sebelum masuk ruang periksa</p>
              </div>
              <Link href="/dashboard/appointments" className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-0.5">
                Semua
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 overflow-y-auto max-h-[260px] pr-1">
              {appointments.map((p) => (
                <div key={p.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={p.name} size="sm" />
                    <div className="min-w-0 space-y-0.5 leading-none">
                      <div className="text-caption font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {p.attendingDoctor}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={p.status}>{p.status}</Badge>
                    <button
                      onClick={() => handleAction(p.name)}
                      className="px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded text-[10px] font-bold transition-all focus-ring cursor-pointer"
                    >
                      Masuk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              <div>
                <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Aktivitas & Transaksi Log Sistem
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Integrasi audit trail Hyperledger Fabric</p>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full select-none flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Ledger Sync
              </span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 overflow-y-auto max-h-[260px] pr-1">
              {MOCK_ACTIVITIES.map((act) => (
                <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-6 font-sans text-caption">
                  <div className="space-y-0.5 leading-normal">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-850 dark:text-white">
                        {act.actor}
                      </span>
                      <span className="text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-250 dark:border-neutral-750 px-1 py-0.2 rounded font-bold uppercase scale-90">
                        {act.role}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-300">
                        {act.action}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 italic">
                      {act.details}
                    </p>
                    <div className="font-mono text-[9px] text-neutral-400 flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      <span>{act.txHash}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 flex-shrink-0 mt-0.5 font-medium">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW — Doctor Workload BarChart (Full Width) */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 h-[270px]">
        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
          <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Beban Kerja Dokter Hari Ini
          </h3>
          <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Jumlah antrean pasien aktif per dokter spesialis</p>
        </div>

        <div className="flex-1 min-h-0 text-[10px] font-mono h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DOCTOR_WORKLOAD} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <RechartsTooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "hsl(var(--secondary))", fontSize: "11px" }}
                labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: "10px" }}
              />
              <Bar dataKey="load" name="Antrean" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </AppShell>
  );
}
