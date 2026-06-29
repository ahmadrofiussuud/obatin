import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/shared/auth-provider";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ToastProvider } from "@/components/shared/toast-provider";

import { NetworkDetector } from "@/components/shared/network-detector";

// Load Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ObatIn — Platform Administrasi Kesehatan Digital Indonesia",
  description: "Platform SaaS rekam medis digital (EMR) terintegrasi standard FHIR SATUSEHAT Kemenkes, pengamanan blockchain Hyperledger Fabric, dan asisten klinis AI.",
  keywords: ["ObatIn", "EMR", "Rekam Medis Elektronik", "SATUSEHAT", "Kemenkes", "Hyperledger Fabric", "Blockchain Kesehatan", "AI Dokter Indonesia"],
  authors: [{ name: "ObatIn Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased font-sans bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <NetworkDetector />
              {children}
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
