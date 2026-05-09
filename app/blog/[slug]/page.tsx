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
      <Link href="/blog" className="text-sm text-gray-500 hover:text-black">
        ← Back
      </Link>

      {/* HEADER */}
      <header className="mt-10 mb-14 max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          {data.category}
        </p>

        <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
          {data.title}
        </h1>

        <p className="text-gray-500 text-sm">{data.date}</p>
      </header>

      {/* COVER IMAGE */}
      {/* COVER IMAGE */}
{data.image && (
  <div className="relative w-full mb-16 overflow-hidden rounded-2xl bg-black">
    <div className="relative aspect-[16/9] w-full">
      <Image
        src={data.image}
        alt={data.title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 1200px"
        className={`transition duration-700 hover:scale-105 ${
          slug === "gsoc"
            ? "object-contain"
            : "object-cover object-center"
        }`}
      />
    </div>
  </div>
)}
      {/* MARKDOWN */}
      <article className="mx-auto max-w-2xl">
        <div
          className="prose prose-lg prose-neutral max-w-none
          prose-headings:font-serif
          prose-h2:mt-12
          prose-h3:mt-8
          prose-p:text-gray-700 prose-p:leading-8
          prose-img:rounded-xl prose-img:my-10"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              /* ✅ Prevent <p> wrapping images */
              p({ node, children }) {
                const hasImg = node?.children?.some(
                  (child: any) => child.tagName === "img"
                );

                if (hasImg) {
                  return <div className="my-6">{children}</div>;
                }

                return (
                  <p className="text-gray-700 leading-8 my-4">
                    {children}
                  </p>
                );
              },

              /* ✅ Proper markdown images */
              img({ src = "", alt = "" }) {
                return (
                  <span className="block my-10">
                    <Image
                      src={src}
                      alt={alt}
                      width={1200}
                      height={600}
                      className="rounded-xl object-cover w-full h-auto"
                    />
                  </span>
                );
              },

              h1: ({ children }) => (
                <h1 className="text-4xl font-serif mt-10 mb-6">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-2xl font-serif mt-10 mb-4">
                  {children}
                </h2>
              ),

              strong: ({ children }) => (
                <strong className="font-semibold text-black">
                  {children}
                </strong>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  className="underline text-black hover:opacity-70"
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
    </div>
  );
}