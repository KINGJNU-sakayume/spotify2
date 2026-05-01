import React, { useState } from 'react';
import Icon from '../Icon.jsx';
import { fmt } from '../../theme.js';

export default function ListRow({ song, index, onClick, T, F }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
         style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: hov ? T.hoverBg : 'transparent', transition: 'background 0.15s', borderBottom: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 12, color: T.text4, fontWeight: 500, minWidth: 18, textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontFamily: F.body }}>
        {hov ? <Icon name="play" size={12} color={T.text2} /> : index}
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
        <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
             onError={e => { e.target.parentElement.style.background = song.colors.bg3; e.target.style.display = 'none'; }} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: hov ? 'italic' : 'normal', transition: 'font-style 0.15s', fontFamily: hov ? F.heading : F.body }}>{song.title}</div>
        <div style={{ fontSize: 11, color: T.text3, fontFamily: F.body }}>{song.artist}</div>
      </div>
      <div style={{ fontSize: 10, color: T.text4, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: F.body }}>{song.tag}</div>
      <div style={{ fontSize: 11, color: T.text3, fontVariantNumeric: 'tabular-nums', fontFamily: F.body }}>{fmt(song.duration)}</div>
    </div>
  );
}
