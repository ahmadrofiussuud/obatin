"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "./theme-provider";
import { useToast } from "./toast-provider";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/ui/command-palette";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Cpu,
  Link as LinkIcon,
  Compass,
  Bell,
  Sun,
  Moon,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ClipboardList,
  Menu as MenuIcon,
} from "lucide-react";
import Link from "next/link";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background select-none">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="h-10 w-10 bg-secondary/20 rounded-full animate-bounce" />
          <span className="text-caption font-semibold text-neutral-450">Menghubungkan Portal Medis...</span>
        </div>
      </div>
    );
  }

  // 1. Resolve role-based landing URL
  const dashHref = 
    role === "PATIENT" 
      ? "/dashboard/patient" 
      : role === "ADMIN" || role === "SUPER_ADMIN" 
      ? "/dashboard/admin" 
      : "/dashboard";

  // 2. Dynamic branding aesthetics
  const brandName = 
    role === "PATIENT" 
      ? "ObatIn Sehat" 
      : role === "ADMIN" || role === "SUPER_ADMIN" 
      ? "ObatIn Console" 
      : "ObatIn Klinik";

  const brandLetter = 
    role === "PATIENT" 
      ? "S" 
      : role === "ADMIN" || role === "SUPER_ADMIN" 
      ? "C" 
      : "K";

  const brandLogoBg = "bg-[#0D1F3C]";

  // Active theme indicators — PahamIn teal style
  const activeItemClass = "bg-[#0DC6B8]/15 text-[#0DC6B8]";
  const activeIconClass = "text-[#0DC6B8]";

  // 3. Complete list of all system sections
  const navigationSections: SidebarSection[] = [
    {
      title: "Portal Utama",
      items: [
        { label: "Overview Klinik", href: "/dashboard", icon: LayoutDashboard },
        { label: "Dashboard Pasien", href: "/dashboard/patient", icon: LayoutDashboard },
        { label: "Console Admin", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Registrasi Pasien", href: "/dashboard/patients", icon: Users },
        { label: "Janji Temu", href: "/dashboard/appointments", icon: CalendarDays },
      ],
    },
    {
      title: "Klinis (AI)",
      items: [
        { label: "Asisten AI Chat", href: "/dashboard/ai-assistant", icon: Sparkles },
        { label: "Diagnosis AI Form", href: "/dashboard/diagnosis", icon: Cpu },
      ],
    },
    {
      title: "Sistem & Dev",
      items: [
        { label: "Blockchain Log", href: "/dashboard/blockchain", icon: LinkIcon },
        { label: "Portal API", href: "/dashboard/api-portal", icon: Compass },
        { label: "Developer QA", href: "/dashboard/dev/qa", icon: ClipboardList },
      ],
    },
  ];

  // 4. Role-based filtration
  const allowedSections = navigationSections.map((section) => {
    const filteredItems = section.items.filter((item) => {
      if (role === "PATIENT") {
        return (
          item.href === "/dashboard/patient" ||
          item.href === "/dashboard/appointments" ||
          item.href === "/dashboard/ai-assistant"
        );
      }
      if (role === "DOCTOR" || role === "NURSE") {
        return (
          item.href === "/dashboard" ||
          item.href === "/dashboard/patients" ||
          item.href === "/dashboard/appointments" ||
          item.href === "/dashboard/ai-assistant" ||
          item.href === "/dashboard/diagnosis"
        );
      }
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return (
          item.href === "/dashboard/admin" ||
          item.href === "/dashboard/blockchain" ||
          item.href === "/dashboard/api-portal" ||
          item.href === "/dashboard/dev/qa"
        );
      }
      return true;
    });
    return { ...section, items: filteredItems };
  }).filter((section) => section.items.length > 0);

  // 5. Dynamic Bottom Navigation Items
  const bottomNavItems: SidebarItem[] = [];
  if (role === "PATIENT") {
    bottomNavItems.push(
      { label: "Rangkuman Sehat", href: "/dashboard/patient", icon: LayoutDashboard },
      { label: "Tanya MediBot AI", href: "/dashboard/ai-assistant", icon: Sparkles }
    );
  } else {
    bottomNavItems.push({ label: "Utama", href: dashHref, icon: LayoutDashboard });
    if (role === "DOCTOR" || role === "NURSE") {
      bottomNavItems.push(
        { label: "Pasien", href: "/dashboard/patients", icon: Users },
        { label: "Janji", href: "/dashboard/appointments", icon: CalendarDays },
        { label: "AI Chat", href: "/dashboard/ai-assistant", icon: Sparkles }
      );
    } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
      bottomNavItems.push(
        { label: "Ledger Log", href: "/dashboard/blockchain", icon: LinkIcon },
        { label: "Portal API", href: "/dashboard/api-portal", icon: Compass }
      );
    }
  }



  const handleLogout = async () => {
    toast({ title: "Keluar Sistem", description: "Mengakhiri sesi aman Anda...", type: "info" });
    await signOut({ callbackUrl: "/login" });
  };

  const activeBreadcrumb = pathname.split("/").filter(Boolean).map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  });

  // ==================== PATIENT LAYOUT (TOP NAV LAYOUT) ====================
  if (role === "PATIENT") {
    return (
      <div className="min-h-screen font-sans overflow-y-auto pb-16" style={{ background: "#EBF5FB" }}>
        <CommandPalette />

        {/* ===== Patient Navbar (PahamIn style) ===== */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] z-50">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-10">

            {/* Logo */}
            <Link href="/dashboard/patient" className="flex items-center gap-2.5 select-none flex-shrink-0">
              <div className="h-8 w-8 bg-[#0D1F3C] rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-[#0DC6B8]" />
              </div>
              <span className="text-[16px] font-extrabold tracking-tight text-[#0D1F3C]">
                Medi<span className="text-[#0DC6B8]">AI</span>
              </span>
            </Link>

            {/* Nav links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {([
                { label: "Beranda", href: "/dashboard/patient" },
                { label: "Tanya MediBot AI", href: "/dashboard/ai-assistant" },
              ] as { label: string; href: string }[]).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-[14px] font-medium transition-colors ${
                    pathname === item.href
                      ? "text-[#0D1F3C] font-semibold"
                      : "text-neutral-500 hover:text-[#0D1F3C]"
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-0.5 bg-[#0DC6B8] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right: Avatar + Logout + Hamburger */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2 text-neutral-400 hover:text-[#0D1F3C] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {/* Avatar + Name + Logout (Desktop) */}
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-neutral-200">
                <Avatar name={user?.name || "User"} src={user?.image} size="sm" isOnline />
                <div className="leading-none">
                  <p className="text-[12px] font-bold text-[#0D1F3C] truncate max-w-[100px]">{user?.name}</p>
                  <p className="text-[10px] text-[#0DC6B8] uppercase font-bold">Pasien</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
            <div className="fixed top-16 left-0 right-0 bg-white border-b border-neutral-200 z-50 shadow-lg animate-fade-down md:hidden">
              <div className="px-4 py-3 space-y-1">
                {([
                  { label: "Beranda", href: "/dashboard/patient" },
                  { label: "Tanya MediBot AI", href: "/dashboard/ai-assistant" },
                ] as { label: string; href: string }[]).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                      pathname === item.href
                        ? "text-[#0D1F3C] font-bold bg-[#0DC6B8]/8"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-4 pt-2 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={user?.name || "User"} src={user?.image} size="sm" isOnline />
                  <div>
                    <p className="text-[13px] font-bold text-[#0D1F3C] truncate max-w-[130px]">{user?.name}</p>
                    <p className="text-[10px] text-[#0DC6B8] uppercase font-bold">Pasien</p>
                  </div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="p-2 text-neutral-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Content Frame */}
        <main className="w-full pt-16">
          {children}
        </main>
      </div>
    );
  }

  // ==================== CLINICIAN / ADMIN LAYOUT (SIDEBAR LAYOUT) ====================
  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: "#EBF5FB" }}>

      {/* CMD+K search handler */}
      <CommandPalette />

      {/* Sidebar — Dark Navy PahamIn style */}
      <aside
        className={`hidden md:flex flex-col bg-[#0D1F3C] transition-all duration-250 ease-in-out relative ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center px-4 justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden select-none">
            <div className="h-8 w-8 bg-[#0DC6B8]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-[#0DC6B8]" />
            </div>
            {!collapsed && (
              <span className="text-[15px] font-extrabold tracking-tight text-white truncate">
                Medi<span className="text-[#0DC6B8]">AI</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-grow overflow-y-auto py-4 px-2 space-y-4">
          {allowedSections.map((section, idx) => (
            <div key={idx} className="space-y-0.5">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href}>
                    <Tooltip content={item.label} position="right" className={collapsed ? "" : "hidden"}>
                      <span
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all group ${
                          isActive
                            ? "bg-[#0DC6B8]/15 text-[#0DC6B8]"
                            : "text-white/60 hover:text-white hover:bg-white/8"
                        }`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-[#0DC6B8]" : "text-white/50 group-hover:text-white/80"}`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </span>
                    </Tooltip>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-white/10">
          <div className={`flex items-center justify-between gap-3 ${collapsed ? "flex-col" : ""}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Avatar name={user?.name || "User"} src={user?.image} size="sm" isOnline />
              {!collapsed && (
                <div className="text-left leading-none overflow-hidden space-y-1">
                  <div className="text-[13px] font-semibold text-white truncate">
                    {user?.name || "Loading..."}
                  </div>
                  <div className="text-[10px] text-[#0DC6B8] uppercase font-bold leading-none">
                    {role || "PATIENT"}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      {/* Main Panel Viewport */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden relative">

        {/* Top Header Bar — white, clean */}
        <header className="h-16 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile: hamburger + logo */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 select-none">
                <div className="h-7 w-7 bg-[#0D1F3C] rounded-md flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-[#0DC6B8]" />
                </div>
                <span className="text-[14px] font-extrabold text-[#0D1F3C] truncate max-w-[110px]">
                  Medi<span className="text-[#0DC6B8]">AI</span>
                </span>
              </div>
            </div>

            {/* Breadcrumbs (Desktop only) */}
            <div className="hidden md:flex items-center gap-1.5 text-caption font-semibold text-neutral-505 select-none">
              {activeBreadcrumb.slice(0, 3).map((item, idx) => (
                <React.Fragment key={item}>
                  {idx > 0 && <span className="text-neutral-300">/</span>}
                  <span className={idx === activeBreadcrumb.slice(0, 3).length - 1 ? "text-neutral-850 dark:text-neutral-200" : ""}>
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search triggers */}
            <button
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
                );
              }}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[12px] text-neutral-500 hover:text-[#0D1F3C] flex items-center gap-4 hover:bg-neutral-100 transition-all cursor-pointer h-9"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Pencarian...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-[9px] font-sans">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <button
              onClick={() =>
                toast({
                  title: "Pemberitahuan",
                  description: "Belum ada pesan masuk faskes.",
                  type: "info",
                })
              }
              className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring h-9 w-9 flex items-center justify-center cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-ring h-9 w-9 flex items-center justify-center cursor-pointer"
            >
              {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
          </div>
        </header>

        {/* Scroll Content Frame */}
        <main className="flex-grow overflow-y-auto p-4 md:p-6 max-w-[1440px] w-full mx-auto" style={{ background: "#EBF5FB" }}>
          {children}
        </main>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs transition-opacity"
              onClick={() => setMenuOpen(false)}
            />

            {/* Mobile Drawer — dark navy */}
            <div className="relative flex flex-col w-64 max-w-xs bg-[#0D1F3C] h-full p-4 space-y-4 animate-fade-right shadow-xl">
              {/* Logo / Header close */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5 select-none">
                  <div className="h-7 w-7 bg-[#0DC6B8]/20 rounded-md flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-[#0DC6B8]" />
                  </div>
                  <span className="text-[14px] font-extrabold text-white">
                    Medi<span className="text-[#0DC6B8]">AI</span>
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded-md text-white/40 hover:text-white/80"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex-grow overflow-y-auto space-y-4">
                {allowedSections.map((section, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="px-3 text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">
                      {section.title}
                    </div>
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                            isActive
                              ? "bg-[#0DC6B8]/15 text-[#0DC6B8]"
                              : "text-white/60 hover:text-white hover:bg-white/8"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isActive ? "text-[#0DC6B8]" : "text-white/50"}`} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Profile Footer */}
              <div className="border-t border-neutral-200/50 dark:border-neutral-800/35 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar name={user?.name || "User"} src={user?.image} size="sm" isOnline />
                    <div className="text-left leading-none overflow-hidden space-y-1">
                      <div className="text-[11px] font-semibold text-neutral-850 dark:text-neutral-200 truncate max-w-[110px]">
                        {user?.name}
                      </div>
                      <div className="text-[9px] text-neutral-400 uppercase font-bold">
                        {role}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
