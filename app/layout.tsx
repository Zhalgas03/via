export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import NavbarWrapper from "./components/navbar/NavbarWrapper"

import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Viamart",
  description: "Delivery platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-light`}
        style={{ backgroundColor: "#171717" }}
      >
        <NavbarWrapper />

        <main className="page-container">
          {children}
        </main>
      </body>
    </html>
  )
}

