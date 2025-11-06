import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {Provider} from "@/components/Provider"
import {Toaster} from "react-hot-toast"

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
  title: "AskWithPDF: The Best PDF AI Chat App",
  description: "We built AskYourPDF as the only PDF AI Chat App you will ever need. Easily upload your PDF files and engage with our intelligent chat AI to extract valuable insights from your documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Provider>
     <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <div className="main">
          <div className="gradient"/>
        </div> */}
        <main className="app">
          {children}
        </main>
        <Toaster position="top-center"/>
      </body>
    </html>
    </Provider>
    </ClerkProvider>
  );
}
