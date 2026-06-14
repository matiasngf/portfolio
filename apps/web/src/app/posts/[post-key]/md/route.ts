import { parse } from "node-html-parser";
import TurndownService from "turndown";
import { projectsConfig } from "../posts-config";

// Rendered on demand: the Markdown is derived from the live page HTML.
export const dynamic = "force-dynamic";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

/**
 * Serves a post as Markdown without exposing the original `.mdx` source.
 *
 * Pipeline: mdx -> html -> md. The `mdx -> html` step reuses Next's own page
 * rendering (we fetch the rendered page), so only the public, compiled output
 * is ever exposed — never the source file.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ "post-key": string }> }
) {
  const { "post-key": postKey } = await params;
  const config = projectsConfig[postKey];
  if (!config) {
    return new Response("Not found", { status: 404 });
  }

  // mdx -> html (via Next's page render)
  const pageUrl = new URL(`/posts/${postKey}`, req.url);
  const pageRes = await fetch(pageUrl, { headers: { accept: "text/html" } });
  if (!pageRes.ok) {
    return new Response("Not found", { status: 404 });
  }

  const root = parse(await pageRes.text());
  const content = root.querySelector("#post-content");
  if (!content) {
    return new Response("Not found", { status: 404 });
  }

  // next/image rewrites srcs to `/_next/image?url=<encoded>&w=..&q=..`.
  // Decode them back to plain asset paths and drop responsive attributes so
  // the Markdown ends up with clean image links.
  const html = content.innerHTML
    .replace(/\ssrcset="[^"]*"/gi, "")
    .replace(/\ssizes="[^"]*"/gi, "")
    .replace(/src="\/_next\/image\?url=([^&"]+)[^"]*"/gi, (_match, encoded) =>
      `src="${decodeURIComponent(encoded)}"`
    );

  // html -> md
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(config.name)}`,
    `description: ${JSON.stringify(config.description)}`,
    `tags: [${config.tags.join(", ")}]`,
    "---",
    "",
    "",
  ].join("\n");

  const markdown = frontmatter + turndown.turndown(html) + "\n";

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}
