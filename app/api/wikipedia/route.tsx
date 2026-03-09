import { NextResponse } from "next/server";

const SEARCH_TERMS: Record<string, string[]> = {
  Sports: [
    "football club",
    "tennis player",
    "olympic athlete",
    "basketball team",
    "cricket player",
    "rugby union",
    "baseball player",
    "golf tournament",
    "cycling race",
    "boxing champion",
    "swimming world",
    "athletics champion",
    "nba player",
    "formula one driver",
    "ice hockey team",
  ],
  Music: [
    "rock band",
    "jazz musician",
    "classical composer",
    "hip hop album",
    "pop singer",
    "opera singer",
    "folk music artist",
    "blues musician",
    "punk band",
    "indie artist",
    "music producer",
    "symphony orchestra",
    "country music artist",
    "electronic music",
    "reggae artist",
  ],
  Film: [
    "feature film",
    "film director",
    "movie actor",
    "documentary film",
    "animated film",
    "film festival",
    "television series",
    "film producer",
    "silent film",
    "horror movie",
    "science fiction film",
    "drama film",
    "comedy film",
    "action movie",
    "film award winner",
  ],
  Politics: [
    "prime minister",
    "political party",
    "presidential election",
    "parliament member",
    "senator",
    "government minister",
    "political revolution",
    "foreign policy",
    "civil rights movement",
    "political campaign",
    "head of state",
    "cabinet minister",
    "constitutional law",
    "political reform",
    "diplomatic relations",
  ],
  Science: [
    "physics discovery",
    "biology research",
    "chemistry Nobel",
    "mathematics theorem",
    "astronomy telescope",
    "quantum mechanics",
    "evolutionary biology",
    "neuroscience research",
    "genetics discovery",
    "space exploration",
    "particle physics",
    "marine biology",
    "climate science",
    "paleontology fossil",
    "scientific journal",
  ],
  Technology: [
    "software company",
    "computer science",
    "artificial intelligence",
    "machine learning",
    "internet technology",
    "robotics engineering",
    "semiconductor chip",
    "cybersecurity",
    "mobile application",
    "programming language",
    "tech startup",
    "operating system",
    "video game developer",
    "cloud computing",
    "blockchain technology",
  ],
  History: [
    "ancient civilization",
    "medieval history",
    "world war",
    "historical empire",
    "colonial history",
    "revolution history",
    "archaeological discovery",
    "historical battle",
    "dynasty history",
    "roman empire",
    "greek history",
    "renaissance period",
    "industrial revolution",
    "cold war",
    "ottoman empire",
  ],
  Military: [
    "military battle",
    "naval warfare",
    "air force operation",
    "army general",
    "military history",
    "war campaign",
    "siege warfare",
    "military strategy",
    "armed forces",
    "warship history",
    "military aircraft",
    "special forces",
    "military conflict",
    "infantry regiment",
    "nuclear weapon",
  ],
  Nature: [
    "animal species",
    "bird species",
    "mammal biology",
    "fish species",
    "insect entomology",
    "plant botany",
    "tree species",
    "marine ecosystem",
    "wildlife conservation",
    "endangered species",
    "fossil dinosaur",
    "coral reef",
    "primate behavior",
    "reptile species",
    "tropical rainforest",
  ],
  Place: [
    "city history",
    "island geography",
    "mountain range",
    "river basin",
    "national park",
    "historical landmark",
    "capital city",
    "coastal town",
    "geographical region",
    "lake geography",
    "desert geography",
    "world heritage site",
    "ancient city",
    "peninsula geography",
    "valley geography",
  ],
  Business: [
    "company founded",
    "corporation history",
    "bank financial",
    "airline company",
    "retail brand",
    "stock market",
    "investment fund",
    "pharmaceutical company",
    "manufacturing company",
    "startup business",
    "venture capital",
    "multinational corporation",
    "trade company",
    "financial institution",
    "economic enterprise",
  ],
  Arts: [
    "painting artwork",
    "sculpture artist",
    "architecture building",
    "photography art",
    "art exhibition",
    "museum collection",
    "contemporary art",
    "abstract painting",
    "art movement",
    "visual artist",
    "art gallery",
    "ceramic art",
    "portrait painting",
    "modern art",
    "installation art",
  ],
  Literature: [
    "novel author",
    "poetry collection",
    "playwright drama",
    "literary award",
    "fiction writer",
    "biography book",
    "short story",
    "literary movement",
    "novelist career",
    "pulitzer prize",
    "booker prize",
    "literary criticism",
    "fantasy novel",
    "historical fiction",
    "science fiction novel",
  ],
  Religion: [
    "religious history",
    "church history",
    "mosque architecture",
    "temple ancient",
    "religious figure",
    "theology study",
    "christian history",
    "muslim history",
    "hindu tradition",
    "buddhist teaching",
    "jewish history",
    "religious text",
    "mythology ancient",
    "religious ceremony",
    "spiritual leader",
  ],
  Medicine: [
    "medical disease",
    "syndrome disorder",
    "medical treatment",
    "surgical procedure",
    "medical research",
    "hospital history",
    "pharmacology drug",
    "vaccine development",
    "cancer research",
    "cardiology heart",
    "neurology brain",
    "psychiatry mental",
    "public health",
    "medical discovery",
    "infectious disease",
  ],
  Education: [
    "university history",
    "college academic",
    "school education",
    "professor academic",
    "educational institution",
    "research university",
    "scholarship education",
    "degree program",
    "educational reform",
    "academic journal",
    "educational history",
    "learning institution",
    "academic achievement",
    "teaching pedagogy",
    "campus university",
  ],
  Food: [
    "cuisine history",
    "dish recipe",
    "food culture",
    "chef cooking",
    "restaurant history",
    "wine region",
    "beer brewing",
    "food ingredient",
    "cooking tradition",
    "baking bread",
    "cheese variety",
    "seafood cuisine",
    "dessert recipe",
    "spice trade",
    "culinary art",
  ],
  Transport: [
    "railway history",
    "locomotive train",
    "ship vessel",
    "aircraft aviation",
    "airport history",
    "highway road",
    "bridge engineering",
    "tunnel construction",
    "metro subway",
    "automobile history",
    "motorcycle racing",
    "bicycle history",
    "port harbor",
    "canal waterway",
    "steam engine",
  ],
  Culture: [
    "cultural festival",
    "traditional ceremony",
    "folklore mythology",
    "cultural heritage",
    "ethnic tradition",
    "indigenous culture",
    "dance performance",
    "theatre history",
    "cultural movement",
    "costume tradition",
    "carnival celebration",
    "language tradition",
    "tribal culture",
    "performing arts",
    "cultural exchange",
  ],
  Person: [
    "biography",
    "born",
    "historical figure",
    "notable person",
    "explorer",
    "inventor",
    "philosopher",
    "activist",
    "entrepreneur",
    "journalist",
    "athlete biography",
    "artist biography",
    "politician biography",
    "scientist biography",
    "military leader",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchRandomSummary(): Promise<Record<string, unknown>> {
  const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary", {
    headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
    next: { revalidate: 0 },
  });
  return res.json();
}

async function fetchByCategory(category: string): Promise<Record<string, unknown>[]> {
  const terms = SEARCH_TERMS[category] ?? [];
  if (!terms.length) return [];

  // Run 4 searches in parallel with different random terms
  const selectedTerms = [...terms].sort(() => Math.random() - 0.5).slice(0, 4);

  const batches = await Promise.all(
    selectedTerms.map(async (searchTerm) => {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srlimit=10&format=json&origin=*`;
      const searchRes = await fetch(searchUrl, {
        headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
      });
      const searchData = await searchRes.json();
      const results: { title: string }[] = searchData?.query?.search ?? [];
      return results;
    }),
  );

  // Deduplicate and shuffle all found titles
  const seen = new Set<string>();
  const allResults = batches
    .flat()
    .filter((r) => {
      if (seen.has(r.title)) return false;
      seen.add(r.title);
      return true;
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // Fetch all 10 summaries in parallel
  const summaries = await Promise.all(
    allResults.map((r) =>
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.title)}`, {
        headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
        next: { revalidate: 0 },
      })
        .then((res) => res.json())
        .catch(() => null),
    ),
  );
  return summaries.filter(Boolean);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let articles: Record<string, unknown>[] = [];

    if (!category || category === "All") {
      // Random mode: fetch 10 in parallel
      articles = await Promise.all(Array.from({ length: 10 }, fetchRandomSummary));
    } else {
      articles = await fetchByCategory(category);
      articles = articles.slice(0, 10);
    }

    const cleaned = articles.map((a) => ({
      id: a.pageid,
      title: a.title,
      extract: a.extract,
      thumbnail: (a.thumbnail as { source?: string })?.source ?? null,
      url:
        (a.content_urls as { desktop?: { page?: string } })?.desktop?.page ??
        `https://en.wikipedia.org/wiki/${encodeURIComponent(a.title as string)}`,
      description: !category || category === "All" ? ((a.description as string) ?? null) : category,
    }));

    return NextResponse.json({ articles: cleaned });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
