import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
        <header className="sticky top-0 z-50 border-b border-border bg-card-bg/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
                MP
              </span>
              <span className="text-sm font-semibold tracking-tight">
                MyProject
              </span>
            </Link>
            <span className="text-xs text-muted">
              Oriental Consultants Global
            </span>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-auto border-t border-border bg-card-bg">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="flex flex-col items-center gap-2 text-xs text-muted sm:flex-row sm:justify-between">
              <p>&copy; {new Date().getFullYear()} Kurihara Yuta</p>
              <p>Oriental Consultants Global Co., Ltd.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
