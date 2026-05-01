import React, { useState } from 'react';
import Icon from '../Icon.jsx';

export default function PickCard({ song, onClick, T, F }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
         style={{ background: T.cardBg, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'background 0.2s, transform 0.2s', transform: hov ? 'translateY(-2px)' : 'none', border: `1px solid ${T.cardBorder}` }}>
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
        <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${hov ? 0.85 : 0.78})`, transition: 'filter 0.2s' }}
             onError={e => { e.target.parentElement.style.background = song.colors.bg3; e.target.style.display = 'none'; }} />
        <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 8, color: song.colors.light, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 2, fontFamily: F.body }}>{song.tag}</div>
        {hov && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${song.colors.light},${song.colors.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="play" size={12} color="#fff" />
          </div>
        )}
      </div>
      <div style={{ padding: '12px 12px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text1, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: hov ? 'italic' : 'normal', fontFamily: hov ? F.heading : F.body, transition: 'font-style 0.15s' }}>{song.title}</div>
        <div style={{ fontSize: 10, color: T.text3, fontFamily: F.body }}>{song.artist}</div>
      </div>
    </div>
  );
}
