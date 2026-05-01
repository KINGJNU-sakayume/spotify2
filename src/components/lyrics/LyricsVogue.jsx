import React, { useState, useEffect, useRef } from 'react';
import { ANIMS } from '../../theme.js';

export default function LyricsVogue({ song, lyricIdx, C, F, fontSize, transition }) {
  const cur = song.lyrics[lyricIdx];
  const [animKey, setAnimKey] = useState(0);
  const prev = useRef(cur?.text);
  useEffect(() => {
    if (cur && cur.text !== prev.current) { prev.current = cur.text; setAnimKey(k => k + 1); }
  }, [cur?.text]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'row-reverse', overflow: 'hidden', minWidth: 0 }}>
      <div style={{ width: '48%', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.68) saturate(1.25)' }}
             onError={e => { e.target.parentElement.style.background = C.bg3; e.target.style.display = 'none'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 35%, rgba(14,13,11,0.94) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,13,11,0.45) 0%, transparent 40%)' }} />
        <div style={{ position: 'absolute', bottom: 20, right: 16, textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F.body }}>{song.title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3, fontFamily: F.body }}>{song.album}</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 30, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 9, color: C.light, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none', fontFamily: F.body }}>
            {song.artist} · 가사
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 24px 24px 20px', overflow: 'hidden' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 22, fontWeight: 500, fontFamily: F.body }}>
            LYRICS / {String(lyricIdx + 1).padStart(2, '0')}
          </div>
          <div
            key={animKey}
            aria-live="polite"
            aria-atomic="true"
            style={{ animation: ANIMS[transition] || ANIMS.slideUp, marginBottom: 18 }}>
            <div style={{ fontSize: Math.max(16, Math.round(fontSize * 0.9)), fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: '-1.2px', textTransform: 'uppercase', textShadow: `0 0 30px ${C.light}22`, fontFamily: F.body }}>
              {cur?.text || ''}
            </div>
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 18, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '40%', background: C.accent, borderRadius: 1 }} />
          </div>
          {[1, 2].map(o => song.lyrics[lyricIdx + o] && (
            <div key={o} style={{
              fontSize: Math.max(13, Math.round([0.52, 0.38][o-1] * fontSize)),
              color: `rgba(255,255,255,${[0.42, 0.22][o-1]})`,
              letterSpacing: '0.02em', marginBottom: [12, 7][o-1],
              fontWeight: [500, 400][o-1],
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontFamily: F.body,
            }}>
              {song.lyrics[lyricIdx + o].text}
            </div>
          ))}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.light, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: F.body }}>{song.artist}</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(255,255,255,0.025)', letterSpacing: '-3px', lineHeight: 1, userSelect: 'none', fontFamily: F.heading, fontStyle: 'italic' }}>
              {String(lyricIdx + 1).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
