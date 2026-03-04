import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavbarWrapper from "@/components/NavbarWrapper";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import AdminSeeder from "@/components/AdminSeeder";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "R & T Shop - Premium Tech Store",
  description: "Get the Fastest delivery for Free. Shop online at R & T Shop!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <AdminSeeder />
          <NavbarWrapper />
          {children}
          <Toaster position="top-right" richColors closeButton />
          
          <a href="#chat" className="whatsapp-btn" title="Chat with us">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M20.52 3.48A11.94 11.94 0 0012 0a12 12 0 00-10.4 17.9L0 24l6.26-1.64A11.92 11.92 0 0012 24c6.62 0 12-5.38 12-12a11.94 11.94 0 00-3.48-8.52zm-8.52 18.5a9.92 9.92 0 01-5.06-1.38l-.36-.21-3.76.99.99-3.66-.23-.37A9.96 9.96 0 0112 21.94c5.52 0 10-4.48 10-10a9.96 9.96 0 01-2.92-7.07 9.96 9.96 0 017.07 2.92A10 10 0 0112 21.98zm5.5-7.52c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08A8.4 8.4 0 0110.4 13.6a9.23 9.23 0 01-1.3-1.63c-.18-.3.15-.28.43-.83.08-.15.05-.28-.02-.43-.08-.15-.68-1.63-.93-2.23-.25-.6-.5-.53-.68-.53h-.58c-.2 0-.53.08-.8.38a2.46 2.46 0 00-.78 1.83c0 1.15.8 2.25.9 2.4.1.13 1.63 2.5 3.95 3.5.55.23.98.38 1.33.48.55.18 1.05.15 1.45.1.45-.05 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.12-.27-.2-.57-.35z" />
          </svg>
          </a>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
