import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { valueToEstree } from "estree-util-value-to-estree";
import { visit } from "unist-util-visit";

/**
 * Remark plugin that, for each MDX post:
 *  - assigns a stable slug `id` to every h2/h3 heading, and
 *  - injects `export const tableOfContents = [...]` so the page can render the
 *    table of contents on the server (no client-side DOM scan needed).
 *
 * Server-rendering the TOC keeps the sidebar present after browser back/forward
 * navigation, which a mount-only `useEffect` does not reliably survive.
 */
export default function remarkToc() {
  return (tree) => {
    const slugger = new GithubSlugger();
    const tableOfContents = [];

    visit(tree, "heading", (node) => {
      if (node.depth < 2 || node.depth > 3) return;
      const value = toString(node);
      const id = slugger.slug(value);

      node.data = node.data ?? {};
      node.data.hProperties = { ...(node.data.hProperties ?? {}), id };

      tableOfContents.push({ depth: node.depth, value, id });
    });

    tree.children.unshift({
      type: "mdxjsEsm",
      value: "",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              source: null,
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "tableOfContents" },
                    init: valueToEstree(tableOfContents),
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
}
