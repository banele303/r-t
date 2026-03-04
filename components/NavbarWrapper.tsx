"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  // Hide the store Navbar on all /admin routes
  if (pathname?.startsWith("/admin")) return null;
  return <Navbar />;
}
