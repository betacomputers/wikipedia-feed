import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    if (!query) return NextResponse.json({ articles: [] });

    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=20&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, {
      headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
    });
    const searchData = await searchRes.json();
    const results: { title: string }[] = searchData?.query?.search ?? [];

    const summaries = await Promise.all(
      results.slice(0, 10).map((r) =>
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.title)}`, {
          headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
        })
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null),
      ),
    );

    const articles = summaries.filter(Boolean).map((a) => ({
      id: a.pageid,
      title: a.title,
      extract: a.extract,
      thumbnail: a.thumbnail?.source ?? null,
      url:
        a.content_urls?.desktop?.page ??
        `https://en.wikipedia.org/wiki/${encodeURIComponent(a.title)}`,
      description: a.description ?? null,
    }));

    return NextResponse.json({ articles });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
