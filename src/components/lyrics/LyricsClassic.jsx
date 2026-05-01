import React, { useState, useEffect, useRef } from 'react';
import { ANIMS } from '../../theme.js';

export default function LyricsClassic({ song, lyricIdx, C, F, fontSize, transition }) {
  const cur = song.lyrics[lyricIdx];
  const [animKey, setAnimKey] = useState(0);
  const prev = useRef(cur?.text);
  useEffect(() => {
    if (cur && cur.text !== prev.current) { prev.current = cur.text; setAnimKey(k => k + 1); }
  }, [cur?.text]);

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
      <div style={{ width: '38%', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(1.1)' }}
             onError={e => { e.target.parentElement.style.background = C.bg3; e.target.style.display = 'none'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 45%, rgba(14,13,11,0.97) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,13,11,0.6) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', top: 20, left: 18, fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: F.body }}>♪ NOW PLAYING</div>
        <div style={{ position: 'absolute', bottom: 20, left: 18 }}>
          <div style={{ fontSize: 10, color: C.light, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontFamily: F.body }}>{song.artist}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: F.body }}>{song.album}</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '28px 36px 28px 28px', overflow: 'hidden' }}>
        <div style={{ fontSize: 9, color: C.light, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18, fontFamily: F.body }}>
          {song.artist} — {song.album}
        </div>
        <div
          key={animKey}
          aria-live="polite"
          aria-atomic="true"
          style={{ animation: ANIMS[transition] || ANIMS.slideUp, marginBottom: 20 }}>
          <div style={{ fontSize: Math.max(20, fontSize), fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.8px', fontFamily: F.heading, fontStyle: 'italic', textShadow: `0 0 40px ${C.light}33` }}>
            {cur?.text || ''}
          </div>
        </div>
        <div style={{ height: 2, background: `linear-gradient(to right, ${C.accent}, transparent)`, width: '55%', marginBottom: 22, borderRadius: 1 }} />
        {[1, 2, 3].map(o => song.lyrics[lyricIdx + o] && (
          <div key={o} style={{
            fontSize: [15, 12, 10][o-1],
            color: `rgba(255,255,255,${[0.42, 0.24, 0.13][o-1]})`,
            fontWeight: [500, 400, 300][o-1],
            fontStyle: o === 3 ? 'italic' : 'normal',
            marginBottom: [12, 7, 5][o-1],
            lineHeight: 1.45,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: F.body,
          }}>
            {song.lyrics[lyricIdx + o].text}
          </div>
        ))}
        {song.lyrics[lyricIdx - 1] && (
          <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 10, color: 'rgba(255,255,255,0.16)', fontStyle: 'italic', fontFamily: F.body }}>
            {song.lyrics[lyricIdx - 1].text}
          </div>
        )}
      </div>
    </div>
  );
}
