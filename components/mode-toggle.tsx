"use client"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid a hydration mismatch: render a stable placeholder until mounted.
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  const toggle = () => setTheme(isDark ? "light" : "dark")

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="h-8 w-8 rounded-full"
    >
      {mounted && isDark ? (
        <Moon className="h-[1rem] w-[1rem]" />
      ) : (
        <Sun className="h-[1rem] w-[1rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
