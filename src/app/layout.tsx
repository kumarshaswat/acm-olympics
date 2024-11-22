import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ACM Olympics",
  description: "ACM Olympics @ UT Dallas",
};

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CustomizableSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <div className="flex h-screen">
          <SidebarProvider>
            <CustomizableSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-14 border-b flex items-center px-4">
                <SidebarTrigger />
              </header>
              <main className="flex-1 overflow-auto p-6">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </div>
      </body>
    </html>
  )
}

