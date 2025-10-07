import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'FlowCare App',
  description: 'FlowCare: Health Web-App - A No Country Project'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es' className='scroll-smooth'>
      <body className='flex flex-col min-h-screen bg-gray-50 text-gray-800'>
        <Navbar />
        <main className='flex-grow pt-16'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
