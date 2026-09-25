import { NextRequest, NextResponse } from "next/server";
import { Movie, ArchiveSearchResponse } from "@/types/movie";
import { CURATED_CARTOONS } from "@/data/curatedCartoons";

function cleanDescription(desc?: string): string {
  if (!desc) return "Enjoy this classic animation streaming in high quality from the Internet Archive.";
  // Strip HTML tags and entities
  const stripped = desc
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (stripped.length > 220) {
    return stripped.slice(0, 217) + "...";
  }
  return stripped;
}

function isItemKidSafe(doc: {
  title?: unknown;
  description?: unknown;
  identifier?: unknown;
  subject?: unknown;
}): boolean {
  const textToCheck = [
    Array.isArray(doc.title) ? doc.title.join(" ") : String(doc.title || ""),
    Array.isArray(doc.description) ? doc.description.join(" ") : String(doc.description || ""),
    String(doc.identifier || ""),
    Array.isArray(doc.subject) ? doc.subject.join(" ") : String(doc.subject || ""),
  ]
    .join(" ")
    .toLowerCase();

  // Exact phrases used by Internet Archive warnings
  if (
    textToCheck.includes("inappropriate or offensive") ||
    textToCheck.includes("some may find inappropriate") ||
    textToCheck.includes("content some may find") ||
    textToCheck.includes("content warning") ||
    textToCheck.includes("not suitable for children") ||
    textToCheck.includes("contains nudity") ||
    textToCheck.includes("deemphasize")
  ) {
    return false;
  }

  // Blacklisted sensitive keywords
  const blockedKeywords = [
    "inappropriate",
    "offensive",
    "deemphasize",
    "mature",
    "nudity",
    "nsfw",
    "erotic",
    "porn",
    "gore",
    "cannabis",
    "marijuana",
    "bloody",
  ];

  return !blockedKeywords.some((kw) => textToCheck.includes(kw));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const rowsNum = parseInt(searchParams.get("rows") || "48", 10) || 48;

  // Build query for archive.org advanced search
  let query = "mediatype:movies AND subject:animation";

  if (category === "scifi") {
    query = "mediatype:movies AND (subject:\"science fiction\" OR subject:space OR subject:astronomy OR title:planet OR title:rocket)";
  } else if (category === "animals") {
    query = "mediatype:movies AND (subject:animals OR subject:wildlife OR subject:nature OR title:bunny OR title:bear OR title:fox)";
  } else if (category === "comedy") {
    query = "mediatype:movies AND (subject:slapstick OR subject:comedy OR subject:humor OR subject:funny)";
  } else if (category === "science") {
    query = "mediatype:movies AND (subject:educational OR subject:science OR subject:discovery OR subject:nature)";
  } else if (category === "game") {
    query = "mediatype:movies AND (subject:gameplay OR subject:speedrun OR subject:videogame OR subject:nintendo)";
  } else if (category === "art") {
    query = "mediatype:movies AND (subject:art OR subject:\"stop motion\" OR subject:puppetoons OR title:\"Trip to the Moon\" OR melies)";
  } else if (category === "realfilm") {
    query = "mediatype:movies AND (subject:comedy OR collection:feature_films OR title:keaton OR title:chaplin) AND -subject:animation";
  } else if (category === "popeye") {
    query = "mediatype:movies AND (title:popeye OR subject:popeye)";
  } else if (category === "superman") {
    query = "mediatype:movies AND (title:superman OR subject:superman) AND subject:animation";
  } else if (category === "classic") {
    query = "mediatype:movies AND (collection:classic_cartoons OR subject:cartoon)";
  } else if (category === "fairytales" || category === "fairytale") {
    query = "mediatype:movies AND (fairy OR tales OR cinderella OR snow OR casper)";
  } else if (category === "animation") {
    query = "mediatype:movies AND subject:animation";
  }

  if (q) {
    // If specific search keyword
    const safeQ = q.replace(/[^a-zA-Z0-9\s]/g, "");
    query = `mediatype:movies AND (${safeQ})`;
  }

  // Add strict safe filter to eliminate adult, inappropriate or offensive subjects
  query +=
    ' AND -subject:deemphasize AND -subject:mature AND -subject:inappropriate AND -subject:offensive AND -subject:nudity AND -subject:nude AND -subject:adult AND -subject:nsfw AND -subject:erotic AND -subject:horror AND -subject:blood AND -subject:death AND -subject:cannabis AND -description:"inappropriate or offensive" AND -description:"contains content some may find" AND -description:"contains nudity" AND -description:"mature" AND -title:nudity AND -title:nude AND -title:death';

  const archiveUrl = new URL("https://archive.org/advancedsearch.php");
  archiveUrl.searchParams.set("q", query);
  archiveUrl.searchParams.append("fl[]", "identifier");
  archiveUrl.searchParams.append("fl[]", "title");
  archiveUrl.searchParams.append("fl[]", "description");
  archiveUrl.searchParams.append("fl[]", "licenseurl");
  archiveUrl.searchParams.append("fl[]", "year");
  archiveUrl.searchParams.append("fl[]", "downloads");
  archiveUrl.searchParams.append("fl[]", "rating");
  archiveUrl.searchParams.append("fl[]", "runtime");
  archiveUrl.searchParams.append("fl[]", "subject");
  archiveUrl.searchParams.set("rows", String(rowsNum));
  archiveUrl.searchParams.set("page", String(page));
  archiveUrl.searchParams.set("sort[]", "downloads desc");
  archiveUrl.searchParams.set("output", "json");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(archiveUrl.toString(), {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Archive.org search returned status: ${res.status}`);
    }

    const data: ArchiveSearchResponse = await res.json();
    const docs = data.response?.docs || [];
    const numFound = data.response?.numFound || 2400;

    const formattedMovies: Movie[] = docs
      .filter((doc) => doc.identifier && doc.title && isItemKidSafe(doc))
      .map((doc) => {
        const titleStr = Array.isArray(doc.title)
          ? String(doc.title[0] || "Classic Video")
          : typeof doc.title === "string"
          ? doc.title
          : String(doc.title || "Classic Video");

        const descStr = Array.isArray(doc.description)
          ? String(doc.description[0] || "")
          : typeof doc.description === "string"
          ? doc.description
          : "";

        return {
          identifier: String(doc.identifier),
          title: titleStr,
          description: cleanDescription(descStr),
          year: doc.year || "Classic",
          licenseurl: doc.licenseurl || "http://creativecommons.org/licenses/publicdomain/",
          downloads: doc.downloads || 0,
          rating: doc.rating ? Number(doc.rating) : 4.5,
          runtime: doc.runtime || "8m",
          posterUrl: `https://archive.org/services/img/${doc.identifier}`,
          embedUrl: `https://archive.org/embed/${doc.identifier}`,
          category: category || "animation",
          tags: ["Public Domain", "Kids"],
        };
      });

    // On page 1, merge with curated to ensure instant best results
    let combined = formattedMovies;
    if (page === 1 && combined.length === 0) {
      combined = CURATED_CARTOONS;
    }

    const totalPages = Math.min(Math.ceil(numFound / rowsNum), 100);

    return NextResponse.json({
      success: true,
      count: combined.length,
      page,
      rows: rowsNum,
      numFound,
      totalPages,
      source: "archive.org",
      movies: combined,
    });
  } catch (error) {
    console.warn("Archive.org API query timed out or had error, using curated cartoons fallback:", error);
    // Return curated cartoons filtered by search if present
    let filtered = CURATED_CARTOONS;
    if (q) {
      const lower = q.toLowerCase();
      filtered = CURATED_CARTOONS.filter(
        (m) =>
          String(m.title).toLowerCase().includes(lower) ||
          String(m.description).toLowerCase().includes(lower) ||
          m.tags?.some((t) => String(t).toLowerCase().includes(lower))
      );
    }
    return NextResponse.json({
      success: true,
      count: filtered.length,
      page: 1,
      rows: 48,
      numFound: 2400,
      totalPages: 50,
      source: "curated-fallback",
      movies: filtered,
    });
  }
}
