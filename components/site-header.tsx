"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import { HeadlineBar } from "@/components/headline-bar"

export function SiteHeader() {
  const pathname = usePathname()
  const isDsocRoute = pathname?.startsWith("/dsoc")

  if (isDsocRoute) {
    return null
  }

  return (
    <>
      <HeadlineBar />
      <Navbar />
    </>
  )
}
