import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/footer"
import Script from 'next/script'
import { Analytics } from "@/components/analytics"
import { SiteHeader } from "@/components/site-header"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://devweekends.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Dev Weekends - Your Gateway to becoming a better Software Engineer",
    template: "%s | Dev Weekends"
  },
  description: "Join a thriving community of students and tech enthusiasts learning, building, and growing together through weekend events and bootcamps. Learn from industry experts and enhance your skills in various tech domains.",
  keywords: ["software engineering", "tech community", "coding bootcamp", "mentorship", "tech events", "developer community", "programming", "software development", "tech learning", "career development"],
  authors: [{ name: "Dev Weekends Team" }],
  creator: "Dev Weekends",
  publisher: "Dev Weekends",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: '16x16 32x32' },
      { url: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicons/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devweekends.com",
    title: "Dev Weekends - Your Gateway to becoming a better Software Engineer",
    description: "Join a thriving community of students and tech enthusiasts learning, building, and growing together through weekend events and bootcamps.",
    siteName: "Dev Weekends",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dev Weekends Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Weekends - Your Gateway to becoming a better Software Engineer",
    description: "Join a thriving community of students and tech enthusiasts learning, building, and growing together through weekend events and bootcamps.",
    images: ["/og-image.jpg"],
    creator: "@devweekends",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Dev Weekends',
      url: 'https://devweekends.com',
      logo: 'https://devweekends.com/favicons/android-chrome-512x512.png',
      sameAs: [
        'https://www.linkedin.com/company/devweekends/',
        'https://www.instagram.com/devweekends',
      ],
    },
    {
      '@type': 'WebSite',
      name: 'Dev Weekends',
      url: 'https://devweekends.com',
      description:
        'Learning community for software engineers through events, mentorship, projects, and programs.',
      publisher: {
        '@type': 'Organization',
        name: 'Dev Weekends',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://devweekends.com/sessions',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicons/favicon.ico" sizes="16x16 32x32" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs Full" />
        <link
          rel="alternate"
          type="application/json"
          href="/.well-known/agent-skills/index.json"
          title="Agent Skills Index"
        />
        <link rel="service-desc" type="application/openapi+json" href="/openapi.json" />
        <link rel="service-doc" type="text/html" href="/api-docs" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </head>
      <body className={geist.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              <Analytics />
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

