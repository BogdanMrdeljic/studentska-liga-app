import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SponsorBar } from "@/components/layout/sponsor-bar";
import { Toaster } from "@/components/ui/sonner";

const fallbackFont = Roboto_Condensed({
  variable: "--font-fallback",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Studentska Košarkaška Liga",
  description: "Raspored utakmica, tabela, statistika i objave Studentske košarkaške lige.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${fallbackFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SponsorBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
