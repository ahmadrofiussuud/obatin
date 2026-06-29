"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/shared/toast-provider";
import { CheckSquare, ShieldCheck, Square, Activity } from "lucide-react";

interface ChecklistItem {
  pageName: string;
  items: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
    darkMode: boolean;
    keyboardNav: boolean;
    screenReader: boolean;
    loadingState: boolean;
    errorState: boolean;
    emptyState: boolean;
  };
}

export default function DevQAPage() {
  const { toast } = useToast();

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      pageName: "Main Dashboard (Overview)",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
    {
      pageName: "Patient List Page",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
    {
      pageName: "Patient Detail & EMR Page",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
    {
      pageName: "Appointment Management Page",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
    {
      pageName: "AI Assistant Chatbot",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
    {
      pageName: "Diagnosis Assistant Form",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
    {
      pageName: "Blockchain Audit Trail Logs",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
    {
      pageName: "API Developer Portal Keys",
      items: { desktop: true, tablet: true, mobile: true, darkMode: true, keyboardNav: true, screenReader: true, loadingState: true, errorState: true, emptyState: true },
    },
  ]);

  const toggleCheck = (pageName: string, key: keyof ChecklistItem["items"]) => {
    setChecklist((prev) =>
      prev.map((row) => {
        if (row.pageName === pageName) {
          const updatedItems = { ...row.items, [key]: !row.items[key] };
          return { ...row, items: updatedItems };
        }
        return row;
      })
    );
    toast({ title: "Checklist Diupdate", description: `Status verifikasi ${pageName} diubah.`, type: "success" });
  };

  const getPagePercentage = (item: ChecklistItem["items"]) => {
    const values = Object.values(item);
    const checked = values.filter(Boolean).length;
    return Math.round((checked / values.length) * 100);
  };

  // Calculate Global Completion
  const totalChecks = checklist.length * 9;
  const checkedCount = checklist.reduce((sum, row) => sum + Object.values(row.items).filter(Boolean).length, 0);
  const globalPercentage = Math.round((checkedCount / totalChecks) * 100);

  const getStatusBadge = (percentage: number) => {
    if (percentage === 100) return <Badge variant="ACTIVE">100% VERIFIED</Badge>;
    if (percentage >= 80) return <Badge variant="STABLE">{percentage}% STABLE</Badge>;
    if (percentage >= 50) return <Badge variant="PENDING">{percentage}% PENDING</Badge>;
    return <Badge variant="CRITICAL">{percentage}% CRITICAL</Badge>;
  };

  return (
    <AppShell>
      <PageHeader
        title="Developer QA Checklist & Portal Rilisan"
        description="Portal tinjau penjaminan mutu (Quality Assurance) faskes. Verifikasi kelayakan rendering breakpoint responsif, integrasi dark mode, dan aksesibilitas ramah a11y."
        breadcrumbs={[
          { label: "Utama", href: "/dashboard" },
          { label: "Developer QA Portal" },
        ]}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-caption font-semibold">
        {/* Global Progress */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 flex items-center justify-between">
          <div className="space-y-1.5 leading-none">
            <span className="text-[10px] text-neutral-450 block uppercase">Progress Rilisan Global</span>
            <span className="text-heading-md font-semibold text-neutral-850 dark:text-white mt-1 inline-block">
              {globalPercentage}% Selesai
            </span>
          </div>
          <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary rounded-2xl">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        {/* Total Checks */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 flex items-center justify-between">
          <div className="space-y-1.5 leading-none">
            <span className="text-[10px] text-neutral-450 block uppercase">Poin Verifikasi Teruji</span>
            <span className="text-heading-md font-semibold text-neutral-850 dark:text-white mt-1 inline-block">
              {checkedCount} / {totalChecks} Poin
            </span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>

        {/* QA Status */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl p-5 shadow-soft-1 flex items-center justify-between">
          <div className="space-y-1.5 leading-none">
            <span className="text-[10px] text-neutral-450 block uppercase">Status Kelayakan Rilis</span>
            <span className="text-heading-md font-semibold text-emerald-500 mt-1 inline-block">
              READY FOR PRODUCTION
            </span>
          </div>
          <div className="p-3 bg-secondary-50 dark:bg-secondary-950/20 text-secondary rounded-2xl">
            <Activity className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Checklist Table Grid */}
      <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-soft-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200/60 dark:border-neutral-800/40 font-bold text-neutral-500 uppercase tracking-wider text-[10px] select-none">
                <th className="py-3 px-4">Nama Modul Halaman</th>
                <th className="py-3 px-3 text-center">Desktop</th>
                <th className="py-3 px-3 text-center">Tablet</th>
                <th className="py-3 px-3 text-center">Mobile</th>
                <th className="py-3 px-3 text-center">Dark</th>
                <th className="py-3 px-3 text-center">a11y</th>
                <th className="py-3 px-3 text-center">Skel</th>
                <th className="py-3 px-3 text-center">Err</th>
                <th className="py-3 px-3 text-center">Empty</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            
            <tbody>
              {checklist.map((row) => {
                const pct = getPagePercentage(row.items);
                return (
                  <tr key={row.pageName} className="border-b border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors duration-150 text-caption font-medium">
                    <td className="py-4 px-4 text-neutral-850 dark:text-white font-semibold">{row.pageName}</td>
                    
                    {/* Desktop Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "desktop")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.desktop ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Tablet Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "tablet")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.tablet ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Mobile Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "mobile")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.mobile ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Dark mode Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "darkMode")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.darkMode ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Keyboard nav (a11y) Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "keyboardNav")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.keyboardNav ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Screen Reader (a11y) Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "screenReader")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.screenReader ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Loading State skeleton Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "loadingState")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.loadingState ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Error boundary Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "errorState")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.errorState ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Empty illustrations Check */}
                    <td className="py-4 px-3 text-center">
                      <button onClick={() => toggleCheck(row.pageName, "emptyState")} className="text-neutral-400 hover:text-primary transition-colors cursor-pointer">
                        {row.items.emptyState ? <CheckSquare className="h-4.5 w-4.5 text-primary" /> : <Square className="h-4.5 w-4.5" />}
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(pct)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
