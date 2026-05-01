// ════════════════════════════════════════════════════════════
//  spotifyTrack.js — Shared Spotify Track JSON → internal shape.
//
//  Used by both the build-time fetcher (scripts/fetch-metadata.mjs)
//  and the runtime enrichment in src/App.jsx, so the conversion
//  stays in one place.
// ════════════════════════════════════════════════════════════

// Convert a Spotify `GET /v1/tracks/{id}` JSON payload into the
// minimal metadata shape this app stores per song.
// Returns null if the payload is missing or has no id.
export function spotifyTrackToInternal(t) {
  if (!t || !t.id) return null;
  const art = (t.album?.images || []).slice().sort((a, b) => b.width - a.width)[0];
  return {
    title: t.name,
    artist: (t.artists || []).map((a) => a.name).join(', '),
    album: t.album?.name || '',
    art: art?.url || '',
    duration: Math.round((t.duration_ms || 0) / 1000),
    year: (t.album?.release_date || '').slice(0, 4),
  };
}

// Format a duration in seconds as "M:SS".
export function fmtDur(sec) {
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}
