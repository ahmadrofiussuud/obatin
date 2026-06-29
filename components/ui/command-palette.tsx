"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, FileText, Calendar, Users, Cpu, ShieldAlert, Settings, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: "Navigasi" | "Tindakan" | "AI & Blockchain";
  action: () => void;
  icon: React.ReactNode;
}

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  // Command items static catalog
  const commands: CommandItem[] = [
    {
      id: "nav-dash",
      title: "Ke Dashboard Utama",
      description: "Halaman beranda portal layanan faskes",
      category: "Navigasi",
      icon: <Users className="h-4 w-4" />,
      action: () => router.push("/dashboard"),
    },
    {
      id: "nav-patients",
      title: "Data Pasien (EMR)",
      description: "Daftar rekam medis pasien terintegrasi NIK",
      category: "Navigasi",
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push("/dashboard/doctor"),
    },
    {
      id: "nav-appointments",
      title: "Jadwal Janji Temu",
      description: "Lihat antrean konsultasi hari ini",
      category: "Navigasi",
      icon: <Calendar className="h-4 w-4" />,
      action: () => router.push("/dashboard/doctor"),
    },
    {
      id: "act-new-record",
      title: "Buat Rekam Medis Baru",
      description: "Tulis diagnosa dan keluhan klinis pasien baru",
      category: "Tindakan",
      icon: <Sparkles className="h-4 w-4" />,
      action: () => router.push("/dashboard/doctor"),
    },
    {
      id: "act-ai-helper",
      title: "Diagnosa Banding AI",
      description: "Jalankan prompt OpenAI untuk analisis gejala klinis",
      category: "AI & Blockchain",
      icon: <Cpu className="h-4 w-4" />,
      action: () => router.push("/dashboard/doctor"),
    },
    {
      id: "act-blockchain-verify",
      title: "Verifikasi Integritas Blockchain",
      description: "Audit ledger hash EMR di Hyperledger",
      category: "AI & Blockchain",
      icon: <ShieldAlert className="h-4 w-4" />,
      action: () => router.push("/dashboard/doctor"),
    },
    {
      id: "nav-settings",
      title: "Pengaturan Sistem",
      description: "Konfigurasi token SATUSEHAT & API key faskes",
      category: "Tindakan",
      icon: <Settings className="h-4 w-4" />,
      action: () => router.push("/dashboard/admin"),
    },
  ];

  // Listen to CMD+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setSearch("");
    }
  }, [isOpen]);

  // Handle keyboard navigation inside search list
  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const activeEl = itemsContainerRef.current?.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group commands by category
  const categories = Array.from(new Set(filteredCommands.map((c) => c.category))) as Array<
    "Navigasi" | "Tindakan" | "AI & Blockchain"
  >;

  let globalIndexCounter = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Palette dialog container */}
      <div
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl shadow-premium-lg flex flex-col max-h-[50vh] overflow-hidden z-10"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200/50 dark:border-neutral-800/30">
          <Search className="h-4 w-4 text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari menu, tindakan medis, rekam rekam..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-caption border-none outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-[9px] text-neutral-400 border border-neutral-200 dark:border-neutral-700/50 rounded font-sans leading-none">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2" ref={itemsContainerRef}>
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-caption text-neutral-400">
              Tidak ada hasil ditemukan.
            </div>
          ) : (
            categories.map((cat) => {
              const catItems = filteredCommands.filter((c) => c.category === cat);
              return (
                <div key={cat} className="space-y-1">
                  <div className="px-3 py-1.5 text-[9px] font-bold text-neutral-400 text-label-caps tracking-wider">
                    {cat}
                  </div>
                  {catItems.map((item) => {
                    const currentIndex = globalIndexCounter;
                    globalIndexCounter++;
                    const isSelected = currentIndex === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary dark:bg-primary/20"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded border ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-neutral-100/50 dark:bg-neutral-800 text-neutral-400 border-neutral-200/50 dark:border-neutral-700/50"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-grow space-y-0.5 leading-none">
                          <p className="text-caption font-semibold">{item.title}</p>
                          <p className="text-[10px] text-neutral-400">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
