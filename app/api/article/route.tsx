import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    if (!title) return NextResponse.json({ sections: [] });

    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(title)}`,
      { headers: { "Api-User-Agent": "wikipedia-feed/1.0" } },
    );
    if (!res.ok) return NextResponse.json({ sections: [] });
    const data = await res.json();

    const skip = new Set([
      "references",
      "external links",
      "notes",
      "see also",
      "further reading",
      "bibliography",
      "footnotes",
    ]);

    const sections: { title: string; content: string }[] = [];

    // Lead section
    const leadSections: { text?: string }[] = data.lead?.sections ?? [];
    for (const s of leadSections) {
      if (s.text?.trim()) {
        sections.push({ title: "", content: s.text });
      }
    }

    // Remaining sections — flat array, not nested
    const remaining: { line?: string; text?: string; toclevel?: number }[] =
      data.remaining?.sections ?? [];

    for (const section of remaining) {
      const line = section.line ?? "";
      if (section.toclevel === 1 && skip.has(line.toLowerCase())) continue;
      if (section.text?.trim()) {
        sections.push({ title: line, content: section.text });
      }
    }

    return NextResponse.json({ sections });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
