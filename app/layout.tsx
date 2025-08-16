'use client'

import type React from "react"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

// Metadata moved to head.tsx or individual pages since this is now a client component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <head>
        <title>Minha Coleção Otaku</title>
        <meta name="description" content="Gerencie sua coleção de mangás, animes e jogos" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <div className="min-h-screen bg-background">
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
