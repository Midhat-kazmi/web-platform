import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, FileCode, Presentation } from "lucide-react";

export const metadata = {
  title: "Brand Kit & Speaker Resources",
  description:
    "Download Dev Weekends logos and the official session slide template. Designed for speakers, mentors, and community partners.",
};

const logos = [
  {
    name: "Logo on Dark Badge",
    description: "White wordmark on a black circle. Use on light or dark backgrounds.",
    file: "/brand/dw-logo-white.jpg",
    download: "dev-weekends-logo-white.jpg",
    previewClass: "bg-muted/40",
  },
  {
    name: "Black Wordmark",
    description: "Solid black wordmark on a transparent background. Use on light surfaces only.",
    file: "/brand/dw-logo-black.jpg",
    download: "dev-weekends-logo-black.jpg",
    previewClass: "bg-background border",
  },
];

export default function BrandKitPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24 max-w-6xl">
      <div className="mb-14">
        <p className="text-xs font-bold uppercase tracking-[3px] text-muted-foreground mb-3">
          Artifacts
        </p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
          Brand Kit & Speaker Resources
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Everything you need to represent Dev Weekends consistently. Logos for posts and
          decks, plus the official slide template for community sessions.
        </p>
      </div>

      <section className="mb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Logos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Right-click to copy, or use the download button.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="border border-border bg-card overflow-hidden flex flex-col"
            >
              <div
                className={`relative h-64 flex items-center justify-center ${logo.previewClass}`}
              >
                <Image
                  src={logo.file}
                  alt={logo.name}
                  width={220}
                  height={220}
                  className="object-contain max-h-48 w-auto"
                />
              </div>
              <div className="p-6 border-t border-border flex flex-col gap-4">
                <div>
                  <h3 className="font-bold mb-1">{logo.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {logo.description}
                  </p>
                </div>
                <a
                  href={logo.file}
                  download={logo.download}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background text-xs font-semibold uppercase tracking-[1px] hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Session Slide Template</h2>
          <p className="text-sm text-muted-foreground mt-1">
            The official deck speakers use for community sessions. Open in a browser to
            preview, then duplicate into Google Slides, Keynote, or PowerPoint.
          </p>
        </div>

        <div className="border border-border bg-card grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
          <div className="lg:col-span-3 bg-[#070707] flex items-center justify-center p-10 min-h-[280px]">
            <div className="text-center text-white/90 max-w-sm">
              <Presentation className="w-12 h-12 mx-auto mb-4 text-white/70" />
              <p className="text-sm uppercase tracking-[3px] text-white/50 mb-2">
                Dev Weekends
              </p>
              <p className="text-2xl font-black mb-3">Session Template v2</p>
              <p className="text-sm text-white/60 leading-relaxed">
                16:9 dark deck with cover, agenda, two-column, full-bleed, and Q&amp;A
                slides ready to use.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 p-8 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-border">
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                session-template.html
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Self-contained HTML deck. Open in any modern browser. No build step
                needed.
              </p>
            </div>

            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>9 pre-built slide layouts</li>
              <li>Inter + Anton typography baked in</li>
              <li>Edit text directly in the HTML</li>
            </ul>

            <div className="flex flex-col gap-3 mt-auto">
              <a
                href="/brand/session-template.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background text-xs font-semibold uppercase tracking-[1px] hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Preview in Browser
              </a>
              <a
                href="/brand/session-template.html"
                download="devweekends-session-template.html"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-xs font-semibold uppercase tracking-[1px] hover:bg-muted transition-colors"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-10">
        <h2 className="text-lg font-bold mb-3">Usage Guidelines</h2>
        <ul className="text-sm text-muted-foreground space-y-2 max-w-2xl leading-relaxed">
          <li>Keep clear space around the logo equal to the height of the wordmark.</li>
          <li>Do not stretch, recolor, or add effects to the logo.</li>
          <li>Use the dark badge version when the background is busy or photographic.</li>
          <li>
            Questions about brand usage? Reach out at{" "}
            <Link
              href="mailto:devweekends@gmail.com"
              className="underline hover:text-foreground"
            >
              devweekends@gmail.com
            </Link>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
