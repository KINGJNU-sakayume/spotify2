import React from 'react';
import Icon from './Icon.jsx';

function NB({ onClick, children, T }) {
  return (
    <button onClick={onClick} style={{ width: 26, height: 26, borderRadius: '50%', background: T.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = T.isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.10)'}
            onMouseLeave={e => e.currentTarget.style.background = T.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}>
      {children}
    </button>
  );
}

export default function TopBar({ T, prevSong, nextSong }) {
  return (
    <div style={{ height: 40, background: T.macBg, display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 10, flexShrink: 0, borderBottom: `1px solid ${T.border}`, userSelect: 'none' }}>
      <div style={{ display: 'flex', gap: 7 }}>
        {['#ff5f56', '#ffbd2e', '#27c93f'].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, boxShadow: '0 0 0 0.5px rgba(0,0,0,0.3)' }} />)}
      </div>
      <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
        <NB onClick={prevSong} T={T}><Icon name="back" size={14} color={T.text2} /></NB>
        <NB onClick={nextSong} T={T}><Icon name="fwd" size={14} color={T.text2} /></NB>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: T.text3, fontWeight: 500, letterSpacing: '0.05em' }}>Editorial Player</span>
      </div>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
        <span style={{ fontSize: 10, color: T.text3, fontWeight: 700 }}>♪</span>
      </div>
    </div>
  );
}
