import React, { useState } from 'react';
import Icon from './Icon.jsx';
import { NOISE_BG } from '../theme.js';

export default function AlbumView({ song, onPlay, onBack, T, F }) {
  const C = song.colors;
  const [hovTrack, setHovTrack] = useState(null);
  const totalDur = song.tracks.reduce((a, t) => { const [m, s] = t.dur.split(':').map(Number); return a + m * 60 + s; }, 0);

  return (
    <div className="ns" style={{ flex: 1, overflowY: 'auto', position: 'relative', animation: 'fadeIn 0.45s ease' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <img src={song.art} alt="" style={{ width: '100%', height: '50%', objectFit: 'cover', filter: 'blur(60px) brightness(0.4) saturate(1.4)', transform: 'scale(1.1)' }}
             onError={e => e.target.style.display = 'none'} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', background: `linear-gradient(to bottom, ${C.bg1}99 0%, transparent 60%)` }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(to bottom, transparent 35%, ${T.bg} 65%)` }} />
      </div>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: T.noiseOp, zIndex: 1, backgroundImage: NOISE_BG }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '28px 40px 40px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.isDark ? 'rgba(255,255,255,0.7)' : '#fff', fontSize: 12, fontWeight: 500, fontFamily: F.body, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, padding: 0, transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <Icon name="back" size={14} color="currentColor" /> 뒤로
        </button>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', marginBottom: 36 }}>
          <div style={{ width: 220, height: 220, borderRadius: 12, overflow: 'hidden', flexShrink: 0, boxShadow: `0 24px 64px ${C.accent}55, 0 8px 24px rgba(0,0,0,0.7)` }}>
            <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                 onError={e => { e.target.parentElement.style.background = C.bg3; e.target.style.display = 'none'; }} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 10, color: '#fff', opacity: 0.7, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10, fontFamily: F.body }}>Album · {song.year}</div>
            <div style={{ fontSize: Math.max(28, Math.min(52, Math.floor(600 / (song.album.length * 0.55 + 1)))), fontWeight: 900, color: '#fff', fontFamily: F.heading, fontStyle: 'italic', lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 14, textShadow: `0 0 60px ${C.light}33` }}>
              {song.album}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: F.body }}>{song.artist}</div>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: F.body }}>{song.genre}</div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 24, fontFamily: F.body }}>
              {song.tracks.length}곡 · {Math.floor(totalDur / 60)}분 {totalDur % 60}초
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => onPlay(song.id)} style={{ padding: '10px 28px', borderRadius: 24, border: 'none', cursor: 'pointer', fontFamily: F.body, fontWeight: 700, fontSize: 14, background: `linear-gradient(135deg,${C.light},${C.accent})`, color: '#fff', boxShadow: `0 4px 20px ${C.accent}55`, transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 6px 28px ${C.accent}77`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 20px ${C.accent}55`; }}>
                ▶ 전체 재생
              </button>
              <div style={{ fontSize: 9, color: C.light, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', border: `1px solid ${C.accent}99`, padding: '5px 12px', borderRadius: 3, fontFamily: F.body, background: 'rgba(0,0,0,0.25)' }}>{song.tag}</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: T.border, marginBottom: 8, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: 80, background: C.accent }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px', gap: 0, padding: '8px 12px', marginBottom: 4 }}>
          <div style={{ fontSize: 10, color: T.text4, fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', fontFamily: F.body }}>#</div>
          <div style={{ fontSize: 10, color: T.text4, fontWeight: 700, letterSpacing: '0.12em', fontFamily: F.body }}>TITLE</div>
          <div style={{ fontSize: 10, color: T.text4, fontWeight: 700, letterSpacing: '0.12em', textAlign: 'right', fontFamily: F.body }}>TIME</div>
        </div>

        <div>
          {song.tracks.map((track, i) => {
            const hov = hovTrack === i;
            return (
              <button key={i} onClick={() => onPlay(song.id)}
                   aria-label={`${track.title} 재생`}
                   onMouseEnter={() => setHovTrack(i)} onMouseLeave={() => setHovTrack(null)}
                   onFocus={() => setHovTrack(i)} onBlur={() => setHovTrack(null)}
                   style={{ display: 'grid', gridTemplateColumns: '36px 1fr 80px', gap: 0, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: hov ? T.hoverBg : 'transparent', transition: 'background 0.15s', border: 'none', borderBottom: `1px solid ${T.border}`, alignItems: 'center', width: '100%', textAlign: 'left' }}>
                <div style={{ textAlign: 'center' }}>
                  {hov
                    ? <Icon name="play" size={13} color={C.accent} />
                    : <span style={{ fontSize: 13, color: T.text3, fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontFamily: F.body }}>{track.n}</span>}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: hov ? 'italic' : 'normal', fontFamily: hov ? F.heading : F.body, transition: 'font-family 0.15s, font-style 0.15s' }}>{track.title}</div>
                  <div style={{ fontSize: 11, color: T.text3, marginTop: 2, fontFamily: F.body }}>{song.artist}</div>
                </div>
                <div style={{ fontSize: 12, color: T.text3, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontFamily: F.body }}>{track.dur}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
