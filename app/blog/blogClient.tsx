"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "./page";

/* ---------------- SWIPER ---------------- */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function imageClasses(post: Post) {
  const fit = post.imageFit === "contain" ? "object-contain" : "object-cover";
  const positionMap = {
    top: "object-top",
    center: "object-center",
    bottom: "object-bottom",
  } as const;
  const position = positionMap[post.imagePosition ?? "center"];
  return `${fit} ${position}`;
}

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState<"news" | "blog">("news");

  /* ---------------- FILTERED DATA ---------------- */

  const filteredPosts = useMemo(
    () =>
      posts
        .filter(
          (post) => post.category?.toLowerCase() === activeTab
        )
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [posts, activeTab]
  );

  const featuredPosts = useMemo(
    () => filteredPosts.filter((post) => post.featured),
    [filteredPosts]
  );

  /* ---------------- COUNTS ---------------- */

  const newsCount = useMemo(
    () =>
      posts.filter(
        (p) => p.category?.toLowerCase() === "news"
      ).length,
    [posts]
  );

  const blogCount = useMemo(
    () =>
      posts.filter(
        (p) => p.category?.toLowerCase() === "blog"
      ).length,
    [posts]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-24">

        {/* ================= HERO ================= */}
        <header className="mb-20 max-w-2xl">
          <p className="uppercase text-xs tracking-[0.25em] text-muted-foreground mb-6">
            Stay updated
          </p>

          <h1 className="text-6xl md:text-7xl font-serif leading-tight mb-8">
            News & Blog
          </h1>

          <p className="text-muted-foreground text-lg">
            Insights, updates, and deep dives into engineering,
            open source, and growth.
          </p>
        </header>

        {/* ================= FEATURED ================= */}
        {featuredPosts.length > 0 && (
          <section className="mb-24">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-10">
              Featured
            </h2>

            <div className="relative group">

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                loop={featuredPosts.length > 2}
                navigation={{
                  nextEl: ".custom-next",
                  prevEl: ".custom-prev",
                }}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="featured-swiper"
              >
                {featuredPosts.map((post) => (
                  <SwiperSlide key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      {/* IMAGE */}
                      <div
                        className={`relative w-full aspect-[4/5] mb-5 overflow-hidden rounded-xl ${
                          post.imageFit === "contain"
                            ? "bg-neutral-950"
                            : "bg-muted"
                        }`}
                      >
                        <Image
                          src={post.image || "/post1.jpg"}
                          alt={post.title}
                          fill
                          priority
                          sizes="(max-width:768px) 100vw, 33vw"
                          className={`rounded-xl transition duration-500 group-hover:scale-[1.02] ${imageClasses(
                            post
                          )}`}
                        />
                      </div>

                      {/* META */}
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>

                      {/* TITLE */}
                      <h3 className="text-lg font-semibold leading-snug group-hover:opacity-70 transition">
                        {post.title}
                      </h3>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* NAVIGATION ARROWS */}
              <button className="custom-prev absolute top-1/2 -left-5 -translate-y-1/2 z-10 bg-background shadow-md rounded-full w-10 h-10 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                ‹
              </button>

              <button className="custom-next absolute top-1/2 -right-5 -translate-y-1/2 z-10 bg-background shadow-md rounded-full w-10 h-10 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                ›
              </button>
            </div>
          </section>
        )}

        {/* ================= TABS ================= */}
        <div className="flex gap-10 border-b border-border mb-16">
          {[
            { key: "news", label: `News (${newsCount})` },
            { key: "blog", label: `Blog (${blogCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as "news" | "blog")
              }
              className={`pb-3 text-sm uppercase tracking-wide transition ${
                activeTab === tab.key
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= POSTS ================= */}
        <div className="space-y-20">
          {filteredPosts.length === 0 ? (
            <p className="text-muted-foreground">
              No posts in this category.
            </p>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                {/* IMAGE */}
                <div
                  className={`relative w-full mb-6 overflow-hidden rounded-xl ${
                    post.imageFit === "contain"
                      ? "aspect-[4/5] bg-neutral-950"
                      : "aspect-[16/9] bg-muted"
                  }`}
                >
                  <Image
                    src={post.image || "/post1.jpg"}
                    alt={post.title}
                    fill
                    sizes="100vw"
                    className={`rounded-xl transition duration-500 group-hover:scale-[1.02] ${imageClasses(
                      post
                    )}`}
                  />
                </div>

                {/* META */}
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                {/* TITLE */}
                <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6 group-hover:opacity-70 transition">
                  {post.title}
                </h2>

                {/* DESCRIPTION */}
                {post.description && (
                  <p className="text-foreground/80 leading-8 max-w-2xl mb-8 text-lg">
                    {post.description}
                  </p>
                )}

                <div className="mt-14 border-b border-border" />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* ================= SWIPER FIX ================= */}
      <style jsx global>{`
        .featured-swiper {
          padding-bottom: 80px !important;
        }

        .featured-swiper .swiper-pagination {
          bottom: 15px !important;
        }

        .featured-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          opacity: 0.4;
          background: hsl(var(--foreground));
        }

        .featured-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .featured-swiper {
            padding-bottom: 100px !important;
          }

          .featured-swiper .swiper-pagination {
            bottom: 35px !important;
          }
        }
      `}</style>
    </div>
  );
}