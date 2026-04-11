import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  description: "Open tools for disaster risk assessment and climate change impact analysis.",
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
        <header className="border-b border-border bg-card-bg/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <span className="text-sm font-semibold tracking-tight">MyProject</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-auto border-t border-border">
          <div className="mx-auto max-w-4xl px-6 py-6 text-center text-xs text-muted">
            &copy; {new Date().getFullYear()} Kurihara Yuta / Oriental Consultants Global
          </div>
        </footer>
      </body>
    </html>
  );
}
