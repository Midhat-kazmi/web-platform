import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filePath = path.join(
    process.cwd(),
    "content",
    "blog",
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-3">Post not found</h1>
          <Link href="/blog" className="underline">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </Link>

      {/* HEADER */}
      <header className="mt-10 mb-14 max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          {data.category}
        </p>

        <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6 text-foreground">
          {data.title}
        </h1>

        <p className="text-muted-foreground text-sm">{data.date}</p>
      </header>

      {/* COVER IMAGE */}
      {data.image && (
        (() => {
          const fit: "cover" | "contain" =
            data.imageFit ?? (slug === "gsoc" ? "contain" : "cover");
          const aspect = fit === "contain" ? "aspect-[4/5]" : "aspect-[16/9]";
          const fitClass =
            fit === "contain" ? "object-contain" : "object-cover object-center";
          return (
            <div className="relative w-full mb-16 overflow-hidden rounded-2xl bg-neutral-950">
              <div className={`relative ${aspect} w-full mx-auto max-w-3xl`}>
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className={`transition duration-700 hover:scale-105 ${fitClass}`}
                />
              </div>
            </div>
          );
        })()
      )}
      {/* MARKDOWN */}
      <article className="mx-auto max-w-2xl">
        <div className="max-w-none">
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
                  <p className="text-foreground/80 leading-[1.85] my-6 text-[1.075rem]">
                    {children}
                  </p>
                );
              },

              img({ src = "", alt = "" }) {
                const url = typeof src === "string" ? src : "";
                // SVG diagrams/charts keep their own aspect ratio, so render
                // them with a plain img instead of forcing next/image's 4:5 box.
                if (url.endsWith(".svg")) {
                  return (
                    <span className="block my-12 overflow-hidden rounded-xl border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={alt} loading="lazy" className="w-full h-auto" />
                    </span>
                  );
                }
                return (
                  <span className="block my-14">
                    <Image
                      src={url}
                      alt={alt}
                      width={1600}
                      height={2000}
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="rounded-xl w-full h-auto"
                    />
                  </span>
                );
              },

              h1: ({ children }) => (
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight mt-16 mb-8 text-foreground">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-3xl font-serif tracking-tight mt-20 mb-6 text-foreground">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-xl font-serif font-semibold mt-12 mb-3 text-foreground">
                  {children}
                </h3>
              ),

              ul: ({ children }) => (
                <ul className="my-6 space-y-2 list-disc pl-6 text-foreground/80 leading-[1.75]">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="my-6 space-y-2 list-decimal pl-6 text-foreground/80 leading-[1.75]">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="pl-1">{children}</li>
              ),

              blockquote: ({ children }) => (
                <blockquote className="my-8 rounded-r-lg border-l-2 border-[#22C55E] bg-[#22C55E]/5 py-2 pl-6 pr-4 italic text-foreground/70">
                  {children}
                </blockquote>
              ),

              hr: () => (
                <hr className="my-16 border-0 h-px bg-border" />
              ),

              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  className="underline underline-offset-4 decoration-muted-foreground text-foreground hover:decoration-foreground transition"
                >
                  {children}
                </a>
              ),

              table: ({ children }) => (
                <div className="my-10 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[0.95rem]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b-2 border-foreground">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-border">{children}</tbody>
              ),
              tr: ({ children }) => <tr>{children}</tr>,
              th: ({ children }) => (
                <th className="py-3 pr-6 font-semibold text-foreground align-top">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="py-3 pr-6 text-foreground/80 align-top">{children}</td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
