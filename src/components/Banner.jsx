import React from 'react';
import { beginLogin, logout } from '../spotify-auth.js';

export default function Banner({ banner, F, loggedIn, setLoggedIn }) {
  if (!banner) return null;
  return (
    <div style={{
      flexShrink: 0,
      padding: '8px 16px',
      background: banner.kind === 'error' ? '#7f1d1d' : banner.kind === 'login' ? '#1db954' : '#374151',
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.01em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      fontFamily: F.body,
    }}>
      <span>{banner.text}</span>
      {banner.kind === 'login' && (
        <button onClick={beginLogin} style={{
          padding: '5px 14px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: '#fff', color: '#1db954', fontSize: 11, fontWeight: 700, fontFamily: F.body,
        }}>
          Spotify 로그인
        </button>
      )}
      {banner.kind !== 'login' && loggedIn && (
        <button onClick={() => { logout(); setLoggedIn(false); }} style={{
          padding: '4px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer',
          background: 'transparent', color: '#fff', fontSize: 10, fontWeight: 600, fontFamily: F.body,
        }}>
          로그아웃
        </button>
      )}
    </div>
  );
}
