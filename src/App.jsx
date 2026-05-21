// ════════════════════════════════════════════════════════════
//  App.jsx — Editorial Spotify-style player (single-page).
//  Applies the user's chosen tweaks as fixed defaults:
//    light theme · editorial fonts · classic lyrics · slideUp · 58px
//    art glow ON · lyrics panel ON
//  Audio playback uses the Spotify Web Playback SDK via useSpotifyPlayer.
//  This file is now just a container that wires state into the
//  presentational components under src/components/.
// ════════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { SONGS as INITIAL_SONGS } from './songs.runtime.js';
import { useSpotifyPlayer } from './spotify-player.js';
import { beginLogin, handleCallback, isConfigured, isLoggedIn, getAccessToken } from './spotify-auth.js';
import {
  SETTINGS, getTheme, FONT_PAIRS,
  getLIdx, NOISE_BG,
} from './theme.js';
import { spotifyTrackToInternal, fmtDur } from './lib/spotifyTrack.js';

import Banner from './components/Banner.jsx';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import HomeView from './components/home/HomeView.jsx';
import AlbumView from './components/AlbumView.jsx';
import LyricsClassic from './components/lyrics/LyricsClassic.jsx';
import LyricsVogue from './components/lyrics/LyricsVogue.jsx';

export default function App() {
  // Songs start from build-time data (songs.runtime) and get enriched with
  // real Spotify metadata once the user logs in (see effect below).
  const [songs, setSongs] = useState(INITIAL_SONGS);

  // Restore last session (song index) from localStorage if present
  const [songIdx, setSongIdx] = useState(() => {
    const saved = parseInt(localStorage.getItem('lastSongIdx') || '0', 10);
    return saved >= 0 && saved < INITIAL_SONGS.length ? saved : 0;
  });
  const [view, setView] = useState('home');             // 'home' | 'player' | 'album'
  const [albumIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  // Lifted auth state — flipping this re-runs the player hook's init effect.
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn());

  // SETTINGS comes pre-filled from theme.js with the user's chosen tweaks
  const T = getTheme(SETTINGS.theme);
  const F = FONT_PAIRS[SETTINGS.fontPair] || FONT_PAIRS.editorial;

  const song = songs[songIdx];
  const C = song.colors;

  // Spotify Web Playback SDK hook (replaces local audio element)
  const audio = useSpotifyPlayer({
    song,
    loggedIn,
    onEnded: () => {
      if (repeat) audio.seek(0);
      else nextSong();
    },
  });

  // Complete Spotify OAuth callback if URL has ?code= on first load.
  useEffect(() => {
    (async () => {
      const ok = await handleCallback();
      if (ok) setLoggedIn(true);
    })();
  }, []);

  // Eagerly populate album art via Spotify's public oEmbed endpoint, which
  // doesn't require auth. This means the cover image shows up immediately on
  // first load instead of waiting for the user to log in. The full /v1/tracks
  // enrichment below still runs after login to fill in everything else
  // (real artist names, durations, etc.).
  useEffect(() => {
    let cancelled = false;
    async function fetchArtFromOEmbed() {
      const stale = songs.filter((s) => s.spotifyId && !s.art);
      if (stale.length === 0) return;
      const fetched = {};
      for (const s of stale) {
        if (cancelled) return;
        try {
          const u = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${s.spotifyId}`;
          const res = await fetch(u);
          if (!res.ok) continue;
          const data = await res.json().catch(() => null);
          if (data?.thumbnail_url) fetched[s.spotifyId] = data.thumbnail_url;
        } catch {
          // Network/CORS failures here are non-fatal — the post-login
          // /v1/tracks enrichment will still fill art in eventually.
        }
      }
      if (cancelled || Object.keys(fetched).length === 0) return;
      setSongs((prev) =>
        prev.map((s) => (fetched[s.spotifyId] && !s.art ? { ...s, art: fetched[s.spotifyId] } : s))
      );
    }
    fetchArtFromOEmbed();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once logged in, enrich any songs that are missing real metadata
  // (i.e. the build-time fetch failed or used placeholders).
  //
  // NOTE: The bulk endpoint `GET /v1/tracks?ids=...` was REMOVED for
  // Development Mode apps in Spotify's February 2026 Web API changes.
  // We now fetch each track individually via `GET /v1/tracks/{id}`,
  // which remains available with a user (PKCE) token.
  useEffect(() => {
    let cancelled = false;
    async function enrich() {
      const stale = songs.filter((s) => s.spotifyId && s._missingMeta);
      if (stale.length === 0) return;
      const token = await getAccessToken();
      if (!token || cancelled) return;
      const ids = stale.map((s) => s.spotifyId);
      const fetched = {};
      for (const id of ids) {
        if (cancelled) return;
        const url = `https://api.spotify.com/v1/tracks/${id}`;
        let res;
        try {
          res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        } catch (e) {
          console.warn(`[runtime-meta] network error for ${id}:`, e?.message || e);
          continue;
        }
        if (!res.ok) {
          // One bad track shouldn't sink the rest. Skip and keep going.
          console.warn(`[runtime-meta] fetch failed for ${id}:`, res.status);
          continue;
        }
        const t = await res.json().catch(() => null);
        const meta = spotifyTrackToInternal(t);
        if (!meta) continue;
        fetched[t.id] = meta;
      }
      if (Object.keys(fetched).length === 0) return;
      if (cancelled) return;
      setSongs((prev) =>
        prev.map((s) => {
          const m = fetched[s.spotifyId];
          if (!m) return s;
          return {
            ...s,
            title: m.title,
            artist: m.artist,
            album: m.album,
            art: m.art,
            duration: m.duration,
            year: m.year,
            tracks: [{ n: 1, title: m.title, dur: fmtDur(m.duration) }],
            _missingMeta: false,
          };
        })
      );
    }
    if (!audio.needsLogin) enrich();
    return () => { cancelled = true; };
  }, [audio.needsLogin]);

  const time = audio.time;
  const duration = audio.duration || song.duration || 1;
  const lyricIdx = getLIdx(song.lyrics, time);
  const progress = Math.min(1, time / duration);

  // Persist last song
  useEffect(() => { localStorage.setItem('lastSongIdx', String(songIdx)); }, [songIdx]);
  // Reset like state when track changes
  useEffect(() => { setLiked(false); }, [songIdx]);

  // Keyboard shortcuts: Space=toggle, ArrowLeft/Right=prev/next, ArrowUp/Down=volume
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); audio.toggle(); }
      else if (e.code === 'ArrowRight' && e.shiftKey) nextSong();
      else if (e.code === 'ArrowLeft' && e.shiftKey) prevSong();
      else if (e.code === 'ArrowRight') audio.seek(time + 5);
      else if (e.code === 'ArrowLeft') audio.seek(Math.max(0, time - 5));
      else if (e.code === 'ArrowUp') audio.setVolume(audio.volume + 5);
      else if (e.code === 'ArrowDown') audio.setVolume(audio.volume - 5);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio.toggle, time, audio.volume]);

  // Pickers / controls
  const scrub = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    audio.seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration);
  };
  const volScrub = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    audio.setVolume(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100));
    if (audio.muted) audio.toggleMute();
  };
  const nextSong = () => { setSongIdx(i => (i + 1) % songs.length); };
  const prevSong = () => { setSongIdx(i => (i - 1 + songs.length) % songs.length); };
  const playSong = (id) => {
    if (audio.needsLogin) {
      if (isConfigured()) beginLogin();
      return;
    }
    setSongIdx(id);
    setView('player');
    audio.play();
  };

  // Player view background: dynamic gradient from album palette (always vivid, regardless of theme)
  const playerBg = `radial-gradient(ellipse 80% 60% at 25% 0%, ${C.bg3}dd 0%, transparent 58%), radial-gradient(ellipse 55% 70% at 85% 100%, ${C.accent}33 0%, transparent 55%), radial-gradient(ellipse 100% 100% at 50% 50%, ${C.bg2} 0%, ${C.bg1} 100%)`;

  const configured = isConfigured();
  const banner =
    !configured ? { kind: 'setup', text: 'Spotify가 설정되지 않았습니다. VITE_SPOTIFY_CLIENT_ID를 .env.local에 추가하세요.' }
    : audio.error === 'premium_required' ? { kind: 'error', text: 'Spotify Premium 계정이 필요합니다.' }
    : audio.error ? { kind: 'error', text: `Spotify 오류: ${audio.error}` }
    : audio.needsLogin ? { kind: 'login', text: '재생하려면 Spotify 로그인이 필요합니다.' }
    : null;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: T.bg, overflow: 'hidden', fontFamily: F.body }}>
      <Banner banner={banner} F={F} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <TopBar T={T} prevSong={prevSong} nextSong={nextSong} />

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar T={T} F={F} view={view} setView={setView} songs={songs} playSong={playSong} />

        {/* Main content */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: view === 'player' ? playerBg : T.bg, transition: 'background 1.8s ease' }}>
          {view === 'player' && (
            <>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: C.accent + '1a', filter: 'blur(90px)', top: '-15%', left: '-5%', transition: 'background 1.8s' }} />
                <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: C.light + '12', filter: 'blur(70px)', bottom: '-5%', right: '5%', transition: 'background 1.8s' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.28, backgroundImage: NOISE_BG }} />
            </>
          )}

          {/* Routed content */}
          <div style={{ flex: 1, position: 'relative', zIndex: 5, overflow: 'hidden', display: 'flex' }}>
            {view === 'home'
              ? <HomeView songs={songs} onPlay={playSong} T={T} F={F} />
              : view === 'album'
                ? <AlbumView song={songs[albumIdx]} onPlay={playSong} onBack={() => setView('home')} T={T} F={F} />
                : SETTINGS.showLyrics
                  ? (SETTINGS.lyricsStyle === 'classic'
                      ? <LyricsClassic song={song} lyricIdx={lyricIdx} C={C} F={F} fontSize={SETTINGS.lyricsFontSize} transition={SETTINGS.lyricsTransition} key={`classic-${songIdx}`} />
                      : <LyricsVogue   song={song} lyricIdx={lyricIdx} C={C} F={F} fontSize={SETTINGS.lyricsFontSize} transition={SETTINGS.lyricsTransition} key={`vogue-${songIdx}`} />)
                  : (
                    // Lyrics off — show just centered art (with glow if enabled)
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, paddingBottom: 16 }}>
                      <div style={{ width: 280, height: 280, borderRadius: 16, overflow: 'hidden', boxShadow: SETTINGS.artGlow ? `0 30px 80px ${C.accent}55, 0 8px 24px rgba(0,0,0,0.7)` : '0 8px 24px rgba(0,0,0,0.5)' }}>
                        <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: audio.playing ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.8s' }}
                             onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = C.bg3; }} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4, fontFamily: F.heading, fontStyle: 'italic' }}>{song.title}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{song.artist}</div>
                      </div>
                    </div>
                  )}
          </div>
        </div>
      </div>

      <PlayerBar
        T={T} C={C} song={song} audio={audio}
        time={time} duration={duration} progress={progress}
        scrub={scrub} volScrub={volScrub}
        prevSong={prevSong} nextSong={nextSong}
        liked={liked} setLiked={setLiked}
        shuffle={shuffle} setShuffle={setShuffle}
        repeat={repeat} setRepeat={setRepeat}
        view={view} setView={setView}
      />
    </div>
  );
}
