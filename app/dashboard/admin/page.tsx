"use client";

import React from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/shared/toast-provider";
import { Activity, ShieldAlert, Cpu, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const { toast } = useToast();

  const handleBackup = () => {
    toast({
      title: "Pencadangan Sistem",
      description: "Menyalin rekam medis terenkripsi ke cold storage...",
      type: "success",
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Dashboard Portal Admin & B2G"
        description="Monitor status koneksi server faskes, validasi ledger Hyperledger Fabric, audit sinkronisasi SATUSEHAT, dan atur API key developer."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Dashboard Admin" },
        ]}
        actions={
          <button
            onClick={handleBackup}
            className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
          >
            <ShieldAlert className="h-4 w-4" />
            Cadangkan Sistem
          </button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pengguna Sistem" value="1,240 User" change={12.4} icon={Users} />
        <StatCard title="Koneksi Faskes Aktif" value="45 Institusi" icon={Activity} />
        <StatCard title="Transaksi Blok Berjalan" value="428.9K Block" change={8.5} icon={ShieldAlert} />
        <StatCard title="API Response Time" value="45 Millisecond" change={-2.1} icon={Cpu} />
      </div>

      {/* System Monitor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PostgreSQL & Redis Monitor */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 space-y-5">
          <h3 className="text-heading-md font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            Status Server & Basis Data
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800/50 last:border-none">
              <div>
                <p className="text-body-md font-semibold text-neutral-800 dark:text-neutral-200">Database Utama (PostgreSQL)</p>
                <p className="text-caption text-neutral-500">Host: localhost:5432 / DB: obatin</p>
              </div>
              <Badge variant="ACTIVE">ONLINE</Badge>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800/50 last:border-none">
              <div>
                <p className="text-body-md font-semibold text-neutral-800 dark:text-neutral-200">Cache Node (Redis)</p>
                <p className="text-caption text-neutral-500">Host: localhost:6379</p>
              </div>
              <Badge variant="ACTIVE">ONLINE</Badge>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-neutral-100 dark:border-neutral-800/50 last:border-none">
              <div>
                <p className="text-body-md font-semibold text-neutral-800 dark:text-neutral-200">Hyperledger Peer Nodes</p>
                <p className="text-caption text-neutral-500">Channel: obatin-channel (4 Peers)</p>
              </div>
              <Badge variant="ACTIVE">ONLINE</Badge>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-6 shadow-soft-1 space-y-4">
          <h3 className="text-heading-md font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            Token Sandbox SATUSEHAT
          </h3>
          
          <p className="text-caption text-neutral-500 leading-normal">
            Salin token JWT enkripsi berikut untuk autentikasi endpoint FHIR API di lingkungan sandbox BPJS Kemenkes.
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 select-all cursor-pointer">
            <code className="text-[10px] break-all text-neutral-600 dark:text-neutral-400 font-mono">
              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWdpc3RyeUlkIjoiMTAwMDAwMDQiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MTkzOTEwMDB9.mockSignatureForSATUSEHATIntegration
            </code>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWdpc3RyeUlkIjoiMTAwMDAwMDQiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MTkzOTEwMDB9.mockSignatureForSATUSEHATIntegration");
              toast({ title: "Salin Token", description: "SATUSEHAT API Token disalin ke clipboard.", type: "success" });
            }}
            className="w-full py-2 bg-primary text-white rounded-lg text-caption font-semibold hover:bg-primary-600 transition-all focus-ring cursor-pointer"
          >
            Salin API Token
          </button>
        </div>

      </div>
    </AppShell>
  );
}
