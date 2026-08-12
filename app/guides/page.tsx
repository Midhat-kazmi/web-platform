import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GuidesClient from "./guidesClient";

export const metadata = {
  title: "Guides | Dev Weekends",
  description:
    "Curated, practical guides by Dev Weekends on cracking tech roles, building habits, open source, and growing as an engineer.",
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  order: number;
  date: string;
  author?: string;
  icon?: string;
  readingTime?: string;
};

// Launch set of categories. Categories with zero guides still render a tab
// with an empty state so the structure is visible as content grows.
export const GUIDE_CATEGORIES = [
  "Career & Tech Roles",
  "Productivity & Habits",
  "Open Source",
  "Mindset & Growth",
] as const;

export default function GuidesPage() {
  const guidesDir = path.join(process.cwd(), "content", "guides");

  let files: string[] = [];
  if (fs.existsSync(guidesDir)) {
    files = fs.readdirSync(guidesDir).filter((f) => f.endsWith(".md"));
  }

  const guides: Guide[] = files.map((file) => {
    const filePath = path.join(guidesDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const slug = file.replace(/\.md$/, "");

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      category: data.category ?? "Mindset & Growth",
      featured: data.featured ?? false,
      order: data.order ?? 999,
      date: data.date ?? "",
      author: data.author ?? "Dev Weekends",
      icon: data.icon ?? "BookOpen",
      readingTime: data.readingTime ?? "",
    };
  });

  return (
    <GuidesClient
      guides={guides}
      categories={[...GUIDE_CATEGORIES]}
    />
  );
}
