import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // `/posts/<key>.md` serves the Markdown rendition of a post.
  const match = pathname.match(/^\/posts\/([^/]+)\.md$/);
  if (match) {
    const url = req.nextUrl.clone();
    url.pathname = `/posts/${match[1]}/md`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/posts/:path*",
};
