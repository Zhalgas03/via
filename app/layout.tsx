import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Navbar from "./components/navbar/Navbar"
// ✅ Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"

// ✅ Global styles
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark text-light`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  )
}
