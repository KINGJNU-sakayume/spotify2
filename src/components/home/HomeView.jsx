import React from 'react';
import { NOISE_BG } from '../../theme.js';
import SectionHeader from './SectionHeader.jsx';
import FeaturedCard from './FeaturedCard.jsx';
import PickCard from './PickCard.jsx';
import ListRow from './ListRow.jsx';

export default function HomeView({ songs, onPlay, T, F }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Pick songs for each section. With your own catalog, the first two are
  // featured, all are quick picks, the last 4 are recently played.
  const featured = songs.slice(0, 2);
  const picks = songs;
  const recent = [...songs].slice(-4);

  return (
    <div className="ns" style={{ flex: 1, overflowY: 'auto', padding: '32px 36px 24px', position: 'relative', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: T.noiseOp, backgroundImage: NOISE_BG, zIndex: 0 }} />

      <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, color: T.text3, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8, fontFamily: F.body }}>
          Vol. 1 · {today}
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, color: T.text1, fontFamily: F.heading, fontStyle: 'italic', letterSpacing: '-1px', lineHeight: 1, marginBottom: 4 }}>
          {greeting}
        </div>
        <div style={{ height: 1, background: `linear-gradient(to right, ${T.borderStrong}, transparent)`, marginTop: 16 }} />
      </div>

      {featured.length > 0 && (
        <>
          <div style={{ marginBottom: 36, position: 'relative', zIndex: 1 }}>
            <SectionHeader label="Featured" sub="이번 주 추천" T={T} F={F} />
            <div style={{ display: 'grid', gridTemplateColumns: featured.length > 1 ? '1fr 1fr' : '1fr', gap: 16 }}>
              {featured.map(s => <FeaturedCard key={s.id} song={s} onClick={() => onPlay(s.id)} T={T} F={F} />)}
            </div>
          </div>
          <div style={{ height: 1, background: T.border, marginBottom: 32, position: 'relative', zIndex: 1 }} />
        </>
      )}

      <div style={{ marginBottom: 36, position: 'relative', zIndex: 1 }}>
        <SectionHeader label="Quick Picks" sub="바로 재생" link="SEE ALL" T={T} F={F} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {picks.map(s => <PickCard key={s.id} song={s} onClick={() => onPlay(s.id)} T={T} F={F} />)}
        </div>
      </div>

      <div style={{ height: 1, background: T.border, marginBottom: 32, position: 'relative', zIndex: 1 }} />

      <div style={{ marginBottom: 24, position: 'relative', zIndex: 1 }}>
        <SectionHeader label="Recently Played" sub="최근 재생" T={T} F={F} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {recent.map((s, i) => <ListRow key={i} song={s} index={i + 1} onClick={() => onPlay(s.id)} T={T} F={F} />)}
        </div>
      </div>
    </div>
  );
}
