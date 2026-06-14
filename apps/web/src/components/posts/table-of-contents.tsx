"use client";

import type { Heading } from "@/content";
import { useEffect } from "react";

interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * Self-contained active-section tracker.
 *
 * It runs in two ways so it works in every navigation scenario:
 *  - as a server-rendered <script>, so it executes on the initial document and
 *    on browser back/forward (where React does not re-run client effects), and
 *  - re-executed from a useEffect, so it also runs on client-side soft
 *    navigations (where React-inserted <script> tags do not execute).
 *
 * It is idempotent: listeners are bound once, and `update` reads the current
 * `[data-toc-link]` elements from the DOM so a single binding serves any post.
 */
const TOC_SCRIPT = `
(function () {
  function update() {
    var links = document.querySelectorAll('[data-toc-link]');
    if (!links.length) return;
    var offset = 120;
    var current = links[0].getAttribute('href').slice(1);
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= offset) current = id;
      else break;
    }
    for (var j = 0; j < links.length; j++) {
      var link = links[j];
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    }
  }
  window.__tocUpdate = update;
  update();
  if (window.__tocBound) return;
  window.__tocBound = true;
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  window.addEventListener('pageshow', update);
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-toc-link]') : null;
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    }
  });
})();
`;

export function TableOfContents({ headings }: TableOfContentsProps) {
  useEffect(() => {
    // Soft navigations don't execute the server-rendered <script>, so run it here.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    new Function(TOC_SCRIPT)();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="font-sans text-sm sticky top-16 max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">
        Contents
      </p>
      <ul className="space-y-2 border-l border-foreground/15">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.depth - 2) * 0.75}rem` }}>
            <a
              href={`#${h.id}`}
              data-toc-link
              className="toc-link -ml-px block border-l-2 border-transparent pl-4 py-0.5 leading-snug text-foreground/45 transition-colors hover:text-foreground/80"
            >
              {h.value}
            </a>
          </li>
        ))}
      </ul>
      <script dangerouslySetInnerHTML={{ __html: TOC_SCRIPT }} />
    </nav>
  );
}
