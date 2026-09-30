import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Childcare",
  description:
    "A public forum where working families and researchers share childcare experiences, challenges, and ideas for improvement.",
};

const NAV = [
  { href: "/", label: "Topics" },
  { href: "/sharings", label: "Browse Sharings" },
  { href: "/share", label: "Share Your Experience" },
  { href: "/discussions", label: "Discussion Board" },
  { href: "/about", label: "About" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex flex-wrap items-center gap-x-8 gap-y-2">
            <Link href="/" className="text-lg font-semibold tracking-tight text-amber-600">
              Childcare
            </Link>
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-600">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-amber-700">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-stone-500 space-y-1">
            <p>
              An operations management research initiative on childcare systems. Sharings are
              public and anonymized; no personal identifying information is collected.
            </p>
            <p>
              <Link href="/admin" className="hover:text-amber-700">
                Moderation
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
