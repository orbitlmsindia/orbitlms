import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Orbit - Modern Learning Management System",
  description: "A comprehensive LMS platform for universities, colleges, and training institutes",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" closeButton richColors />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
