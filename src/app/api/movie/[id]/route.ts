import { NextRequest, NextResponse } from "next/server";
import { MovieDetailResponse, MovieFile } from "@/types/movie";

interface ArchiveMetadataFile {
  name: string;
  source?: string;
  format: string;
  size?: string;
  height?: string;
  width?: string;
}

interface ArchiveMetadataRaw {
  server?: string;
  dir?: string;
  metadata?: {
    identifier?: string;
    title?: string;
    description?: string;
    year?: string;
    date?: string;
    licenseurl?: string;
    subject?: string | string[];
    collection?: string | string[];
  };
  files?: ArchiveMetadataFile[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
  }

  const metadataUrl = `https://archive.org/metadata/${encodeURIComponent(id)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(metadataUrl, {
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache metadata for 24h
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Failed to fetch metadata: ${res.status}`);
    }

    const data: ArchiveMetadataRaw = await res.json();

    // Check for inappropriate or offensive content warnings in metadata
    const metaSubject = data.metadata?.subject;
    const metaCollection = data.metadata?.collection;
    const textToCheck = [
      data.metadata?.title || "",
      data.metadata?.description || "",
      Array.isArray(metaSubject) ? metaSubject.join(" ") : String(metaSubject || ""),
      Array.isArray(metaCollection) ? metaCollection.join(" ") : String(metaCollection || ""),
    ]
      .join(" ")
      .toLowerCase();

    const isUnsafe =
      textToCheck.includes("inappropriate or offensive") ||
      textToCheck.includes("some may find inappropriate") ||
      textToCheck.includes("content warning") ||
      textToCheck.includes("contains content some may find") ||
      textToCheck.includes("deemphasize") ||
      textToCheck.includes("not suitable for children") ||
      textToCheck.includes("mature") ||
      textToCheck.includes("nudity") ||
      textToCheck.includes("nsfw") ||
      textToCheck.includes("erotic") ||
      textToCheck.includes("porn");

    if (isUnsafe) {
      return NextResponse.json({
        success: true,
        movie: {
          identifier: id,
          title: data.metadata?.title || "Blocked Content",
          description: "This item contains content some may find inappropriate or offensive and has been blocked by the Kid-Safe filter.",
          embedUrl: "",
          posterUrl: `https://archive.org/services/img/${id}`,
          files: [],
          blocked: true,
          blockReason: "This item contains content some may find inappropriate or offensive.",
        },
      });
    }

    const files: ArchiveMetadataFile[] = data.files || [];

    // Filter MP4/video files
    const videoFiles: MovieFile[] = files
      .filter((f) => {
        const name = (f.name || "").toLowerCase();
        const fmt = (f.format || "").toLowerCase();
        return (
          name.endsWith(".mp4") ||
          name.endsWith(".m4v") ||
          fmt.includes("mp4") ||
          fmt.includes("mpeg4") ||
          fmt.includes("h.264")
        );
      })
      .map((f) => ({
        name: f.name,
        format: f.format,
        size: f.size,
        height: f.height,
        width: f.width,
      }));

    // Find best playable direct video URL
    let videoUrl = "";
    if (videoFiles.length > 0) {
      // Pick best file - prefer 512kb / 720p / h.264 or first mp4
      const preferred =
        videoFiles.find((f) => f.name.toLowerCase().includes("512kb")) ||
        videoFiles.find((f) => f.name.toLowerCase().endsWith(".mp4")) ||
        videoFiles[0];
      if (preferred) {
        videoUrl = `https://archive.org/download/${id}/${preferred.name}`;
      }
    }

    const detail: MovieDetailResponse = {
      identifier: id,
      title: data.metadata?.title || id,
      description: data.metadata?.description || "",
      year: data.metadata?.year || data.metadata?.date?.substring(0, 4) || "Classic",
      date: data.metadata?.date,
      licenseurl: data.metadata?.licenseurl || "http://creativecommons.org/licenses/publicdomain/",
      embedUrl: `https://archive.org/embed/${id}`,
      posterUrl: `https://archive.org/services/img/${id}`,
      videoUrl: videoUrl || undefined,
      files: videoFiles,
    };

    return NextResponse.json({ success: true, movie: detail });
  } catch (error) {
    console.warn(`Error fetching metadata for ${id}, using fallback URLs:`, error);
    return NextResponse.json({
      success: true,
      movie: {
        identifier: id,
        title: id.replace(/[-_]/g, " "),
        description: "Public domain and Creative Commons animation provided by Archive.org",
        embedUrl: `https://archive.org/embed/${id}`,
        posterUrl: `https://archive.org/services/img/${id}`,
        files: [],
      },
    });
  }
}
