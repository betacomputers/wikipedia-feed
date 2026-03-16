import { NextResponse } from "next/server";

async function fetchLinks(title: string): Promise<{ title: string }[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=links&pllimit=50&plnamespace=0&format=json&origin=*`;
  const res = await fetch(url, { headers: { "Api-User-Agent": "wikipedia-feed/1.0" } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data?.query?.pages ?? {}) as { links?: { title: string }[] }[];
  const links = pages[0]?.links ?? [];
  return links.sort(() => Math.random() - 0.5).slice(0, 30);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    if (title) {
      const links = await fetchLinks(title);
      return NextResponse.json({ links });
    }

    // Random root article
    const randomRes = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary", {
      headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
    });
    const a = await randomRes.json();
    const node = {
      id: a.pageid as number,
      title: a.title as string,
      extract: (a.extract as string)?.slice(0, 200) ?? "",
      thumbnail: (a.thumbnail as { source?: string })?.source ?? null,
      url: (a.content_urls as { desktop?: { page?: string } })?.desktop?.page ?? "",
    };

    const links = await fetchLinks(a.title);
    return NextResponse.json({ node, links });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
