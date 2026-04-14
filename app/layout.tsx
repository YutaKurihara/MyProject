import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const BP = process.env.__NEXT_ROUTER_BASEPATH || "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyProject | Kurihara Yuta",
  description:
    "Open tools for disaster risk assessment and climate change impact analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-50 border-b border-border bg-card-bg/95 backdrop-blur-md">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center">
              <Image
                src={`${BP}/images/ocg-logo.png`}
                alt="Oriental Consultants Global"
                width={220}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-auto border-t border-border bg-card-bg">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="flex flex-col items-center gap-2 text-xs text-muted sm:flex-row sm:justify-between">
              <p>サイト責任者: 栗原 悠太 / <a href="mailto:kurihara-yt@ocglobal.jp" className="hover:underline">kurihara-yt@ocglobal.jp</a></p>
              <p>&copy; {new Date().getFullYear()} Oriental Consultants Global Co., Ltd.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
