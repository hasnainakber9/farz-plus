"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPlatformRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  if (isPlatformRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
