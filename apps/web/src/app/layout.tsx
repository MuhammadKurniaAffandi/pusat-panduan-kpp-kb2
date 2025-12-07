import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { Toaster } from "@/components/ui/sonner";
import Favicon from "./logo-kementerian-keuangan-356.png";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pusat Panduan - KPP Pratama Jakarta Kebayoran Baru Dua",
  description: "Pusat panduan dan informasi layanan perpajakan",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
