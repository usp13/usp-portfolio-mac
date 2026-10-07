import { NextRequest, NextResponse } from "next/server";

// In-memory cache for fast 0ms repeated resolution
const videoCache = new Map<string, string>([
  ["The Weeknd Blinding Lights", "fHI8X4OXluQ"],
  ["The Weeknd Starboy", "34Na4j8AVgA"],
  ["Coldplay Yellow", "tdVAqxNLXiw"],
  ["Coldplay Viva La Vida", "y4zdDXPYo0I"],
  ["Coldplay A Sky Full of Stars", "VPRjCeoBqrI"],
  ["Arijit Singh Kesariya", "LIHABJUqZ7s"],
  ["Arijit Singh Zaalima", "hhdSyU1719Q"],
  ["Eminem Lose Yourself", "Wj7lL6eDOqc"],
  ["Eminem Without Me", "pyb13N80DZQ"],
  ["Taylor Swift Cruel Summer", "ic8j13piAhQ"],
  ["Dua Lipa Levitating", "TUVcZfQe-Kw"],
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || !query.trim()) {
    return NextResponse.json({ success: false, error: "Missing query" }, { status: 400 });
  }

  const cleanQuery = query.trim();

  // Check cache
  if (videoCache.has(cleanQuery)) {
    return NextResponse.json({ success: true, videoId: videoCache.get(cleanQuery) });
  }

  // Also check if cleanQuery matches any key case-insensitively
  const lowerQuery = cleanQuery.toLowerCase();
  for (const [k, v] of videoCache.entries()) {
    if (k.toLowerCase() === lowerQuery || lowerQuery.includes(k.toLowerCase())) {
      return NextResponse.json({ success: true, videoId: v });
    }
  }

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      cleanQuery + " official audio"
    )}`;

    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 86400 }, // Cache on edge/Next.js for 24h
    });

    const html = await res.text();

    // Regex 1: /watch?v=...
    let match = html.match(/watch\?v=([a-zA-Z0-9_-]{11})/);

    // Regex 2: "videoId":"..."
    if (!match) {
      match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    }

    if (match && match[1]) {
      const videoId = match[1];
      videoCache.set(cleanQuery, videoId);
      return NextResponse.json({ success: true, videoId });
    }

    // Try fallback search without "official audio"
    const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
    const fallbackRes = await fetch(fallbackUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const fallbackHtml = await fallbackRes.text();
    const fallbackMatch =
      fallbackHtml.match(/watch\?v=([a-zA-Z0-9_-]{11})/) ||
      fallbackHtml.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);

    if (fallbackMatch && fallbackMatch[1]) {
      const videoId = fallbackMatch[1];
      videoCache.set(cleanQuery, videoId);
      return NextResponse.json({ success: true, videoId });
    }

    return NextResponse.json(
      { success: false, error: "Could not find video for query" },
      { status: 404 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
