import React from 'react';
import Icon from './Icon.jsx';

function SBI({ icon, label, active, accent, onClick, T, F }) {
  const col = active ? T.text1 : accent ? T.isDark ? '#9d9dff' : '#7c3aed' : T.text2;
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 6, cursor: 'pointer', background: active ? T.navActive : 'transparent', transition: 'background 0.15s' }}
         onMouseEnter={e => e.currentTarget.style.background = T.hoverBg}
         onMouseLeave={e => e.currentTarget.style.background = active ? T.navActive : 'transparent'}>
      <Icon name={icon} size={17} color={col} />
      <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: col, whiteSpace: 'nowrap', fontFamily: F.body }}>{label}</span>
    </div>
  );
}

export default function Sidebar({ T, F, view, setView, songs, playSong }) {
  return (
    <div style={{ width: 220, background: T.surface, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${T.border}` }}>
      <div style={{ padding: '20px 16px 14px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: T.text1, fontFamily: F.heading, fontStyle: 'italic', letterSpacing: '-0.3px' }}>Editorial</div>
        <div style={{ fontSize: 9, color: T.text3, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>Personal — Library</div>
      </div>
      <div style={{ padding: '12px 10px 6px' }}>
        <SBI icon="home" label="Home" active={view === 'home'} onClick={() => setView('home')} T={T} F={F} />
        <SBI icon="search" label="Search" T={T} F={F} />
        <SBI icon="library" label="Your Library" T={T} F={F} />
      </div>
      <div style={{ height: 1, background: T.border, margin: '6px 14px' }} />
      <div style={{ padding: '6px 10px' }}>
        <SBI icon="plus" label="Create Playlist" accent T={T} F={F} />
        <SBI icon="heart" label="Liked Songs" accent T={T} F={F} />
        <SBI icon="star" label="Made For You" accent T={T} F={F} />
      </div>
      <div style={{ height: 1, background: T.border, margin: '6px 14px' }} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 12px' }} className="ns">
        <div style={{ fontSize: 9, color: T.text4, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '6px 12px 8px' }}>Library</div>
        {songs.map(s => (
          <div key={s.id} onClick={() => playSong(s.id)} style={{ fontSize: 12, color: T.text3, padding: '7px 12px', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.15s, background 0.15s' }}
               onMouseEnter={e => { e.currentTarget.style.color = T.text1; e.currentTarget.style.background = T.hoverBg; e.currentTarget.style.fontStyle = 'italic'; }}
               onMouseLeave={e => { e.currentTarget.style.color = T.text3; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.fontStyle = 'normal'; }}>
            {s.title}
          </div>
        ))}
      </div>
    </div>
  );
}
