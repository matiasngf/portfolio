import { projectsConfig } from "./posts-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TableOfContents } from "@/components/posts/table-of-contents";

export function generateStaticParams() {
  return Object.keys(projectsConfig).map((key) => ({ "post-key": key }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ "post-key": string }>;
}) {
  const { "post-key": postKey } = await params;
  const config = projectsConfig[postKey];
  if (!config) notFound();

  const Post = config.post;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
      <article className="min-w-0 max-w-2xl">
        <Link
          href="/"
          className="font-sans text-sm text-foreground/50 hover:text-foreground transition-colors mb-8 inline-block"
        >
          ← Home
        </Link>
        <h1 className="font-serif text-5xl leading-tight mb-4">{config.name}</h1>
        <p className="font-serif italic text-foreground/60 mb-6">
          {config.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-12">
          {config.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-xs tracking-widest uppercase text-foreground/40 border border-foreground/20 px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          id="post-content"
          className="[&_img]:max-w-full [&_img]:rounded [&_p]:mb-4 [&_p]:leading-relaxed [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:mt-8 [&_h3]:mb-3 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:mb-4 [&_pre]:text-sm [&_code]:text-sm"
        >
          <Post />
        </div>
      </article>
      <aside className="hidden lg:block">
        <TableOfContents headings={config.toc} />
      </aside>
    </main>
  );
}
