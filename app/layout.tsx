'use client'
import "./globals.css";
import Layout from "../components/Layout/Sidebar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { NextAuthProvider } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <div className="flex h-screen bg-slate-100 md:flex-row md:overflow-hidden">
            {pathname !== '/' && pathname !== '/register' && pathname !== '/auth/signup' && (
              <div className="w-fit flex-none">
                <Layout />
              </div>
            )}
            <div id="root" className="flex-grow pl-2 pt-2 overflow-auto">
              {children}
            </div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
