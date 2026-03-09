import { NextResponse } from "next/server";

const CATEGORIES: { label: string; keywords: string[] }[] = [
  {
    label: "Sports",
    keywords: [
      "football",
      "soccer",
      "basketball",
      "baseball",
      "cricket",
      "rugby",
      "tennis",
      "golf",
      "cycling",
      "swimmer",
      "swimming",
      "athletics",
      "olympic",
      "nfl",
      "nba",
      "fifa",
      "uefa",
      "championship",
      "league",
      "tournament",
      "club",
      "athlete",
      "boxer",
      "boxing",
      "wrestling",
      "skiing",
      "skating",
      "racing",
      "motorsport",
      "volleyball",
      "hockey",
      "lacrosse",
      "softball",
      "gymnast",
    ],
  },
  {
    label: "Music",
    keywords: [
      "album",
      "song",
      "singer",
      "band",
      "musician",
      "composer",
      "orchestra",
      "symphony",
      "opera",
      "rapper",
      "hip-hop",
      "jazz",
      "blues",
      "rock",
      "pop",
      "discography",
      "record",
      "guitar",
      "piano",
      "vocalist",
      "drummer",
      "conductor",
      "soundtrack",
      "ep",
      "single",
      "genre",
      "punk",
      "metal",
      "folk",
      "indie",
      "reggae",
    ],
  },
  {
    label: "Film",
    keywords: [
      "film",
      "movie",
      "cinema",
      "director",
      "actor",
      "actress",
      "screenplay",
      "documentary",
      "animated",
      "television",
      "tv series",
      "sitcom",
      "drama series",
      "miniseries",
      "streaming",
      "box office",
      "hollywood",
      "bollywood",
    ],
  },
  {
    label: "Politics",
    keywords: [
      "politician",
      "president",
      "prime minister",
      "senator",
      "congressman",
      "parliament",
      "minister",
      "governor",
      "mayor",
      "election",
      "political party",
      "diplomat",
      "ambassador",
      "chancellor",
      "republic",
      "democracy",
      "legislation",
      "constitution",
      "cabinet",
      "congress",
    ],
  },
  {
    label: "Science",
    keywords: [
      "physicist",
      "biologist",
      "chemist",
      "mathematician",
      "astronomer",
      "scientist",
      "researcher",
      "neuroscientist",
      "geologist",
      "ecologist",
      "zoologist",
      "botanist",
      "geneticist",
      "theorem",
      "equation",
      "hypothesis",
      "laboratory",
      "experiment",
      "discovery",
      "nobel",
    ],
  },
  {
    label: "Technology",
    keywords: [
      "software",
      "computer",
      "programmer",
      "engineer",
      "startup",
      "internet",
      "algorithm",
      "artificial intelligence",
      "machine learning",
      "robotics",
      "semiconductor",
      "hardware",
      "app",
      "platform",
      "cybersecurity",
      "database",
      "network",
      "coding",
      "developer",
    ],
  },
  {
    label: "History",
    keywords: [
      "ancient",
      "medieval",
      "century",
      "dynasty",
      "empire",
      "revolution",
      "war",
      "battle",
      "treaty",
      "civilisation",
      "civilization",
      "historical",
      "archaeological",
      "artifact",
      "colony",
      "colonialism",
      "kingdom",
      "reign",
      "pharaoh",
      "samurai",
      "viking",
    ],
  },
  {
    label: "Military",
    keywords: [
      "military",
      "army",
      "navy",
      "air force",
      "general",
      "admiral",
      "colonel",
      "soldier",
      "war",
      "battle",
      "siege",
      "operation",
      "regiment",
      "battalion",
      "brigade",
      "weapon",
      "warship",
      "aircraft carrier",
      "tank",
      "missile",
    ],
  },
  {
    label: "Nature",
    keywords: [
      "species",
      "genus",
      "mammal",
      "bird",
      "fish",
      "insect",
      "reptile",
      "amphibian",
      "plant",
      "tree",
      "flower",
      "fungus",
      "bacteria",
      "virus",
      "ecosystem",
      "habitat",
      "wildlife",
      "conservation",
      "endangered",
      "fossil",
      "dinosaur",
      "marine",
      "coral",
      "primate",
    ],
  },
  {
    label: "Place",
    keywords: [
      "commune",
      "municipality",
      "village",
      "town",
      "city",
      "district",
      "borough",
      "parish",
      "county",
      "province",
      "region",
      "island",
      "peninsula",
      "mountain",
      "river",
      "lake",
      "ocean",
      "sea",
      "bay",
      "cape",
      "valley",
      "desert",
      "forest",
      "national park",
      "landmark",
      "capital",
    ],
  },
  {
    label: "Business",
    keywords: [
      "company",
      "corporation",
      "bank",
      "airline",
      "brand",
      "enterprise",
      "ceo",
      "founded",
      "headquartered",
      "subsidiary",
      "conglomerate",
      "stock",
      "nasdaq",
      "nyse",
      "retail",
      "manufacturer",
      "pharmaceutical",
      "insurance",
      "investment",
      "startup",
      "venture",
    ],
  },
  {
    label: "Arts",
    keywords: [
      "painter",
      "artist",
      "sculptor",
      "architect",
      "photographer",
      "illustrator",
      "designer",
      "ceramicist",
      "printmaker",
      "installation",
      "exhibition",
      "gallery",
      "museum",
      "artwork",
      "painting",
      "sculpture",
      "drawing",
      "sketch",
      "portrait",
      "abstract",
    ],
  },
  {
    label: "Literature",
    keywords: [
      "novelist",
      "author",
      "writer",
      "poet",
      "playwright",
      "essayist",
      "journalist",
      "biography",
      "autobiography",
      "fiction",
      "non-fiction",
      "poem",
      "poetry",
      "short story",
      "novel",
      "book",
      "published",
      "literature",
      "pulitzer",
      "booker",
    ],
  },
  {
    label: "Religion",
    keywords: [
      "religion",
      "church",
      "mosque",
      "temple",
      "cathedral",
      "bishop",
      "priest",
      "monk",
      "imam",
      "rabbi",
      "theology",
      "christian",
      "muslim",
      "hindu",
      "buddhist",
      "jewish",
      "saint",
      "scripture",
      "bible",
      "quran",
      "mythology",
      "god",
      "deity",
      "worship",
    ],
  },
  {
    label: "Medicine",
    keywords: [
      "doctor",
      "physician",
      "surgeon",
      "nurse",
      "medical",
      "disease",
      "syndrome",
      "disorder",
      "treatment",
      "therapy",
      "hospital",
      "anatomy",
      "pharmacology",
      "vaccine",
      "cancer",
      "diabetes",
      "cardiology",
      "neurology",
      "psychiatry",
      "pediatrics",
    ],
  },
  {
    label: "Education",
    keywords: [
      "university",
      "college",
      "school",
      "professor",
      "academic",
      "curriculum",
      "faculty",
      "campus",
      "institute",
      "research",
      "scholarship",
      "degree",
      "phd",
      "student",
      "education",
      "pedagogy",
      "classroom",
    ],
  },
  {
    label: "Food",
    keywords: [
      "food",
      "cuisine",
      "dish",
      "recipe",
      "ingredient",
      "chef",
      "restaurant",
      "cooking",
      "baking",
      "wine",
      "beer",
      "spirits",
      "fruit",
      "vegetable",
      "spice",
      "bread",
      "cheese",
      "meat",
      "seafood",
      "dessert",
      "beverage",
    ],
  },
  {
    label: "Transport",
    keywords: [
      "railway",
      "railroad",
      "locomotive",
      "ship",
      "vessel",
      "aircraft",
      "airport",
      "highway",
      "bridge",
      "tunnel",
      "metro",
      "subway",
      "bus",
      "automobile",
      "car",
      "motorcycle",
      "bicycle",
      "port",
      "canal",
      "road",
    ],
  },
  {
    label: "Culture",
    keywords: [
      "culture",
      "festival",
      "tradition",
      "folklore",
      "mythology",
      "language",
      "ethnic",
      "heritage",
      "ceremony",
      "ritual",
      "custom",
      "tribe",
      "indigenous",
      "dance",
      "theatre",
      "theater",
      "costume",
      "carnival",
    ],
  },
  {
    label: "Person",
    keywords: [
      "born",
      "died",
      "biography",
      "life",
      "career",
      "personal life",
      "early life",
      "childhood",
      "family",
      "married",
      "spouse",
    ],
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function categorize(title: string, description: string | null): string | null {
  const haystack = `${title} ${description ?? ""}`.toLowerCase();
  let bestLabel: string | null = null;
  let bestScore = 0;

  for (const { label, keywords } of CATEGORIES) {
    const score = keywords.reduce((acc, kw) => acc + (haystack.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  }

  return bestScore > 0 ? bestLabel : null;
}

async function fetchRandomSummary(): Promise<Record<string, unknown>> {
  const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary", {
    headers: { "Api-User-Agent": "wikipedia-feed/1.0" },
    next: { revalidate: 0 },
  });
  return res.json();
}

async function fetchByCategory(category: string): Promise<Record<string, unknown>[]> {
  const cat = CATEGORIES.find((c) => c.label === category);
  if (!cat) return [];

  // Pick a random search term from this category
  const searchTerm = pick(cat.keywords);

  // Search Wikipedia for articles matching the term
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srlimit=20&format=json&origin=*`;
  const searchRes = await fetch(searchUrl, { headers: { "Api-User-Agent": "wikipedia-feed/1.0" } });
  const searchData = await searchRes.json();
  const results: { title: string }[] = searchData?.query?.search ?? [];
  if (results.length === 0) return [];

  // Pick 3 random results and fetch their summaries in parallel
  const shuffled = results.sort(() => Math.random() - 0.5).slice(0, 3);
  const summaries = await Promise.all(
    shuffled.map((r) =>
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
      // Category mode: run multiple search rounds until we have 10
      while (articles.length < 10) {
        const batch = await fetchByCategory(category);
        articles.push(...batch);
      }
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
      description:
        category && category !== "All"
          ? category
          : categorize(a.title as string, (a.description as string) ?? null),
    }));

    return NextResponse.json({ articles: cleaned });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
