import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch 10 random articles in parallel
    const fetches = Array.from({ length: 10 }, () =>
      fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary", {
        headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
        next: { revalidate: 0 },
      }).then((r) => r.json()),
    );

    const articles = await Promise.all(fetches);

    const cleaned = articles.map((a) => ({
      id: a.pageid,
      title: a.title,
      extract: a.extract,
      thumbnail: a.thumbnail?.source ?? null,
      url:
        a.content_urls?.desktop?.page ??
        `https://en.wikipedia.org/wiki/${encodeURIComponent(a.title)}`,
      description: a.description ?? null,
    }));

    return NextResponse.json({ articles: cleaned });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
