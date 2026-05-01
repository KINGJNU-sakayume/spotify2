import React, { useState } from 'react';
import Icon from '../Icon.jsx';

export default function FeaturedCard({ song, onClick, T, F }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={`${song.title} - ${song.artist} 재생`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={() => setHov(true)}
      onBlur={() => setHov(false)}
      style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/9', transition: 'transform 0.25s', transform: hov ? 'scale(1.015)' : 'scale(1)', border: 'none', padding: 0, display: 'block', width: '100%' }}>
      <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${hov ? 0.65 : 0.55}) saturate(1.2)`, transition: 'filter 0.25s' }}
           onError={e => { e.target.parentElement.style.background = song.colors.bg3; e.target.style.display = 'none'; }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)' }} />
      <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 9, color: song.colors.light, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: 3, backdropFilter: 'blur(8px)', fontFamily: F.body }}>{song.tag}</div>
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontFamily: F.body }}>{song.artist}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: F.heading, fontStyle: 'italic', letterSpacing: '-0.3px', lineHeight: 1.15, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{song.title}</div>
      </div>
      {hov && (
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${song.colors.light},${song.colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${song.colors.accent}88` }}>
          <Icon name="play" size={14} color="#fff" />
        </div>
      )}
    </button>
  );
}
