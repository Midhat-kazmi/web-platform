import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Metadata } from "next";

const guidesDir = path.join(process.cwd(), "content", "guides");

function readGuide(slug: string) {
  const filePath = path.join(guidesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return matter(fileContent);
}

export function generateStaticParams() {
  if (!fs.existsSync(guidesDir)) return [];
  return fs
    .readdirSync(guidesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = readGuide(slug);
  if (!guide) return { title: "Guide not found | Dev Weekends" };
  return {
    title: `${guide.data.title} | Dev Weekends Guides`,
    description: guide.data.description ?? "",
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = readGuide(slug);

  if (!guide) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="mb-3 text-3xl">Guide not found</h1>
          <Link href="/guides" className="underline">
            Back to guides
          </Link>
        </div>
      </div>
    );
  }

  const { data, content } = guide;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/guides"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Back to guides
        </Link>

        {/* HEADER */}
        <header className="mb-12 mt-10 max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#16A34A]">
            {data.category}
          </p>

          <h1 className="mb-6 font-serif text-4xl leading-tight md:text-5xl">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {data.author && <span>{data.author}</span>}
            {data.author && data.readingTime && <span>•</span>}
            {data.readingTime && <span>{data.readingTime}</span>}
            {data.date && <span>•</span>}
            {data.date && <span>{data.date}</span>}
          </div>
        </header>

        {/* COVER */}
        {data.image && (
          <div className="mb-14 overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.title}
              className="h-auto w-full"
            />
          </div>
        )}

        {/* MARKDOWN */}
        <article className="mx-auto max-w-2xl">
          <div className="prose prose-lg prose-neutral max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p({ node, children }) {
                  const hasImg = node?.children?.some(
                    (child: any) => child.tagName === "img"
                  );
                  if (hasImg) {
                    return <div className="my-12">{children}</div>;
                  }
                  return (
                    <p className="my-6 text-[1.075rem] leading-[1.85] text-foreground/80">
                      {children}
                    </p>
                  );
                },

                img({ src = "", alt = "" }) {
                  return (
                    <span className="my-12 block overflow-hidden rounded-2xl border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={typeof src === "string" ? src : ""}
                        alt={alt}
                        className="h-auto w-full"
                        loading="lazy"
                      />
                    </span>
                  );
                },

                h1: ({ children }) => (
                  <h1 className="mb-8 mt-16 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-6 mt-16 font-serif text-3xl tracking-tight text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-3 mt-10 font-serif text-xl font-semibold text-foreground">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="my-6 list-disc space-y-2 pl-6 leading-[1.75] text-foreground/80">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-6 list-decimal space-y-2 pl-6 leading-[1.75] text-foreground/80">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="pl-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="my-8 rounded-r-lg border-l-2 border-[#22C55E] bg-[#22C55E]/5 py-2 pl-6 pr-4 italic text-foreground/70">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-16 h-px border-0 bg-border" />,
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-foreground underline decoration-muted-foreground underline-offset-4 transition hover:decoration-foreground"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {/* FOOTER CTA */}
        <div className="mx-auto mt-20 max-w-2xl border-t border-border pt-10">
          <Link
            href="/guides"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            ← Explore more guides
          </Link>
        </div>
      </div>
    </div>
  );
}
