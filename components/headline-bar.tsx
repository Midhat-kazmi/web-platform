'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const messages = [
  {
    label: 'DSOC',
    text: 'DSOC 2026 applications are open now. Start your open source journey today.',
    href: '/dsoc',
  },
  {
    label: 'Fellowship',
    text: 'Fellowship 2026 is live. Apply now to join the 3-month mentorship program.',
    href: '/fellowship',
  },
]

export function HeadlineBar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % messages.length
        setLeavingIndex(current)
        setSlideDirection(current === 0 ? 1 : -1)

        window.setTimeout(() => {
          setLeavingIndex(null)
        }, 650)

        return nextIndex
      })
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const activeMessage = messages[activeIndex]
  const leavingMessage = leavingIndex !== null ? messages[leavingIndex] : null
  const enteringAnimation = slideDirection === 1 ? 'headlineEnterFromLeft' : 'headlineEnterFromRight'
  const leavingAnimation = slideDirection === 1 ? 'headlineExitToRight' : 'headlineExitToLeft'

  return (
    <div className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 shadow-[0_10px_30px_rgba(249,115,22,0.35)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-10 items-center justify-center overflow-hidden py-2 text-center text-xs sm:text-sm font-semibold tracking-wide">
          {leavingMessage && (
            <Link
              key={`leaving-${leavingIndex}`}
              href={leavingMessage.href}
              className="absolute inset-x-4 flex items-center justify-center gap-2"
              style={{ animation: `${leavingAnimation} 650ms ease-out both` }}
            >
              <span className="rounded-full bg-slate-950/90 px-2.5 py-0.5 uppercase text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-white shadow-sm">
                {leavingMessage.label}
              </span>
              <span>{leavingMessage.text}</span>
            </Link>
          )}

          <Link
            key={`active-${activeIndex}`}
            href={activeMessage.href}
            className="absolute inset-x-4 flex items-center justify-center gap-2"
            style={{ animation: `${enteringAnimation} 650ms ease-out both` }}
          >
            <span className="rounded-full bg-slate-950/90 px-2.5 py-0.5 uppercase text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-white shadow-sm">
              {activeMessage.label}
            </span>
            <span>{activeMessage.text}</span>
          </Link>
        </div>
      </div>
      <style jsx global>{`
        @keyframes headlineEnterFromLeft {
          from {
            transform: translateX(-120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes headlineEnterFromRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes headlineExitToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        @keyframes headlineExitToLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-120%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
