"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

import { useToast } from "@/components/shared/toast-provider";
import {
  Activity,
  Cpu,
  Lock,
  Search,
  CheckCircle2,
  Copy,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { MOCK_PATIENTS, MockBlockchainAudit } from "@/lib/mock-data";

// Extract all blockchain logs from all patients into a single flat array
const ALL_LEDGER_LOGS: MockBlockchainAudit[] = [];
MOCK_PATIENTS.forEach((p) => {
  p.blockchainLogs.forEach((log) => {
    // Add anonymized patient info to the log
    ALL_LEDGER_LOGS.push({
      ...log,
      id: `${log.id}-${p.id}`,
      // Store patient id on log temporarily
      signerRole: p.id, 
    });
  });
});

// Sort by block number descending
ALL_LEDGER_LOGS.sort((a, b) => b.blockNumber - a.blockNumber);

export default function BlockchainAuditPage() {
  const { toast } = useToast();

  // States
  const [logs, setLogs] = useState<MockBlockchainAudit[]>(ALL_LEDGER_LOGS);
  const [searchHash, setSearchHash] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Tickers
  const [blockCount, setBlockCount] = useState(15903);
  const [lastBlockTime, setLastBlockTime] = useState("3s lalu");
  const [heartbeatActive, setHeartbeatActive] = useState(false);

  // Verification Input
  const [verifyInputHash, setVerifyInputHash] = useState("");
  const [verifiedResult, setVerifiedResult] = useState<"IDLE" | "VALID" | "INVALID" | "PENDING">("IDLE");

  // Simulated live blocks update
  useEffect(() => {
    const blockInterval = setInterval(() => {
      // Toggle heartbeat animation
      setHeartbeatActive(true);
      setTimeout(() => setHeartbeatActive(false), 800);

      // Increment block count
      setBlockCount((prev) => prev + 1);
      setLastBlockTime("0s lalu");

      // Randomly append a new transaction log in memory
      const newBlockNum = blockCount + 1;
      const newLog: MockBlockchainAudit = {
        id: `bc-new-${newBlockNum}`,
        timestamp: new Date().toISOString(),
        action: Math.random() > 0.5 ? "READ_RECORD" : "CONSENT_GRANTED",
        signerName: Math.random() > 0.5 ? "Dr. Sarah Siregar" : "Nurse Linda",
        signerRole: "P-002", // Anonymized patient ID link
        recordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        transactionHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        blockNumber: newBlockNum,
      };

      setLogs((prev) => [newLog, ...prev]);
    }, 12000); // Trigger new block every 12 seconds

    return () => clearInterval(blockInterval);
  }, [blockCount]);

  // Fast ticking for last block time representation
  useEffect(() => {
    const timer = setInterval(() => {
      setLastBlockTime((prev) => {
        if (prev.includes("0s")) return "3s lalu";
        if (prev.includes("3s")) return "8s lalu";
        if (prev.includes("8s")) return "12s lalu";
        return "15s lalu";
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    toast({ title: "Teks Disalin", description: "Hash transaksi berhasil disalin ke clipboard.", type: "success" });
  };

  const handleVerify = () => {
    if (!verifyInputHash.trim()) {
      toast({ title: "Verifikasi Gagal", description: "Masukkan hash transaksi terlebih dahulu.", type: "warning" });
      return;
    }

    setVerifiedResult("PENDING");
    setTimeout(() => {
      // Simple verification check based on hash length or existence
      const isExist = logs.some((l) => l.transactionHash.toLowerCase().includes(verifyInputHash.toLowerCase()));
      if (isExist || verifyInputHash.length > 20) {
        setVerifiedResult("VALID");
        toast({ title: "Integritas Valid", description: "SHA-256 local digest cocok dengan genesis merkle root.", type: "success" });
      } else {
        setVerifiedResult("INVALID");
        toast({ title: "Integritas Gagal", description: "Hash tidak terdaftar atau berkas termanipulasi.", type: "warning" });
      }
    }, 1500);
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.transactionHash.toLowerCase().includes(searchHash.toLowerCase()) ||
      log.signerRole.toLowerCase().includes(searchHash.toLowerCase());
    
    const matchAction = actionFilter === "ALL" ? true : log.action === actionFilter;

    return matchSearch && matchAction;
  });

  return (
    <AppShell>
      <PageHeader
        title="Audit Trail Blockchain Kemenkes"
        description="Audit berkas rekam medis faskes secara real-time. Tinjau hash konsensus ledger Hyperledger Fabric untuk memastikan data bebas manipulasi."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Audit Ledger" },
        ]}
      />

      {/* TOP SECTION — Network Status stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tinggi Blok Konsensus"
          value={`#${blockCount}`}
          change={0.1}
          changeLabel="blocks synced"
          icon={Cpu}
          sparklineData={[blockCount - 6, blockCount - 5, blockCount - 4, blockCount - 3, blockCount - 2, blockCount - 1, blockCount]}
        />
        
        {/* Heartbeat Ticker widget */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 flex items-center justify-between">
          <div className="space-y-1.5 leading-none">
            <span className="text-[10px] text-neutral-450 font-semibold block uppercase">Blok Terakhir Dibuat</span>
            <span className="text-heading-md font-semibold text-neutral-850 dark:text-white mt-1 inline-block">
              {lastBlockTime}
            </span>
          </div>
          <div className={`p-3 bg-secondary-50 dark:bg-secondary-950/20 text-secondary rounded-2xl ${heartbeatActive ? "animate-ping" : ""}`}>
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <StatCard
          title="Kesehatan Node Validator"
          value="99.98%"
          change={0.0}
          changeLabel="vs hari kemarin"
          icon={ShieldCheck}
          sparklineData={[99.98, 99.98, 99.98, 99.98, 99.98, 99.98, 99.98]}
        />

        {/* Live connected nodes visualization card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 flex flex-col justify-between h-[92px]">
          <span className="text-[10px] text-neutral-450 font-semibold uppercase">Mitra Sinkronisasi Node</span>
          <div className="flex items-center gap-1.5 pt-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-neutral-500 font-semibold">
              Kemenkes • RSPI • RSUP • BPJS
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Audit Log Table (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan Tx Hash atau ID Pasien..."
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
              />
            </div>

            {/* Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring text-neutral-600 dark:text-neutral-350 font-semibold"
            >
              <option value="ALL">Semua Tindakan</option>
              <option value="CREATE_RECORD">Record Created</option>
              <option value="READ_RECORD">Record Accessed</option>
              <option value="CONSENT_GRANTED">Consent Granted</option>
            </select>
          </div>

          {/* Audit Trail Table */}
          <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-soft-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200/60 dark:border-neutral-800/40 font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-12 text-center">Blok</th>
                    <th className="py-3 px-4">Aksi</th>
                    <th className="py-3 px-4">Pasien</th>
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">Tx Hash</th>
                    <th className="py-3 px-4 text-center">Verifikasi</th>
                  </tr>
                </thead>
                
                <tbody>
                  {filteredLogs.map((log) => {
                    const isExpanded = expandedId === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                          className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors duration-150 text-caption font-medium cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-center text-neutral-450">
                            #{log.blockNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              log.action.includes("CREATE")
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                                : log.action.includes("READ")
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                                : "bg-purple-50 text-purple-600 dark:bg-purple-950/20"
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-neutral-600 dark:text-neutral-300">
                            {log.signerRole}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-850 dark:text-white font-semibold">
                            {log.signerName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-neutral-450">
                            <div className="flex items-center gap-1">
                              <span>{log.transactionHash.substring(0, 10)}...</span>
                              <button
                                onClick={(e) => handleCopyHash(log.transactionHash, e)}
                                className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-600"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center text-emerald-500">
                              <CheckCircle2 className="h-4.5 w-4.5 fill-emerald-50 dark:fill-transparent" />
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-neutral-50/30 dark:bg-neutral-850/10 border-b border-neutral-150 dark:border-neutral-800/80 font-mono text-[10px]">
                            <td />
                            <td colSpan={5} className="p-5 space-y-3 leading-normal">
                              <div className="grid grid-cols-2 gap-4 font-sans text-caption">
                                <div>
                                  <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Waktu Blok Singkron</span>
                                  <span className="text-[11px] text-neutral-700 dark:text-neutral-300 font-semibold">{log.timestamp}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-neutral-400 text-label-caps block">Status Hash Lokal</span>
                                  <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-0.5">
                                    <ShieldCheck className="h-4 w-4" /> Match (100% Cocok)
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-neutral-200/55 dark:border-neutral-800/40">
                                <div>
                                  <span className="text-[9px] font-bold text-neutral-450 text-label-caps block">SHA-256 Record Digest</span>
                                  <div className="text-neutral-600 dark:text-neutral-400 break-all bg-neutral-100/50 dark:bg-neutral-850 p-1.5 rounded mt-0.5">{log.recordHash}</div>
                                </div>
                                
                                <div>
                                  <span className="text-[9px] font-bold text-neutral-450 text-label-caps block">Full Transaction Hash (Consensus Tx)</span>
                                  <div className="text-neutral-600 dark:text-neutral-400 break-all bg-neutral-100/50 dark:bg-neutral-850 p-1.5 rounded mt-0.5">{log.transactionHash}</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Merkle Verification sidebar panel (5 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 flex flex-col justify-between h-[420px]">
          <div className="space-y-4">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Pencocokan Kunci Verifikasi
              </h3>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Validasi SHA-256 locally digest</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-450 text-label-caps">
                  Hash Transaksi (Tx Hash)
                </label>
                <input
                  type="text"
                  placeholder="Masukkan hash ledger..."
                  value={verifyInputHash}
                  onChange={(e) => setVerifyInputHash(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-850 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={verifiedResult === "PENDING"}
                className="w-full py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center justify-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${verifiedResult === "PENDING" ? "animate-spin" : ""}`} />
                Mulai Verifikasi
              </button>
            </div>
          </div>

          {/* Verification Results Panel */}
          <div className="flex-1 flex items-center justify-center p-3 bg-neutral-50/50 dark:bg-neutral-850/15 border border-neutral-200/60 dark:border-neutral-800/50 rounded-xl mt-4 min-h-[160px]">
            {verifiedResult === "IDLE" && (
              <div className="text-center text-neutral-400 text-caption font-medium space-y-1 select-none">
                <Lock className="h-6 w-6 text-neutral-350 mx-auto" />
                <p>Menunggu Input Hash Kunci...</p>
              </div>
            )}

            {verifiedResult === "PENDING" && (
              <div className="text-center text-neutral-400 text-caption font-medium space-y-2 select-none">
                <RefreshCw className="h-6 w-6 text-primary mx-auto animate-spin" />
                <p>Menjalankan rekonsiliasi merkle tree...</p>
              </div>
            )}

            {verifiedResult === "VALID" && (
              <div className="w-full space-y-3 font-mono text-[9px] text-neutral-550">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-sans font-bold">
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>BERKAS TERSERTIFIKASI UTUH</span>
                </div>
                
                <div className="border-t border-neutral-200/40 dark:border-neutral-800/50 pt-2 space-y-1.5">
                  <div className="truncate">Merkle Root: 7f3c4dbde0ef14dbf77c8e9b6a12f91a...</div>
                  <div className="truncate">Prev Block Hash: a4c5e6f7b8c9d0e1f2a3b4c5d6e7f8...</div>
                  <div className="text-emerald-500 font-sans font-semibold leading-normal mt-1">
                    &quot;This record matches consensus state and has not been tampered with.&quot;
                  </div>
                </div>
              </div>
            )}

            {verifiedResult === "INVALID" && (
              <div className="w-full space-y-3 font-mono text-[9px] text-rose-500">
                <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold">
                  <AlertTriangle className="h-4.5 w-4.5" />
                  <span>KUNCI VERIFIKASI TIDAK SINKRON</span>
                </div>
                <p className="font-sans leading-relaxed text-neutral-500">
                  Hash transaksi local tidak ditemukan di data blok Kemenkes. Ada kemungkinan berkas telah dimutasi secara offline tanpa izin konsensus.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </AppShell>
  );
}
