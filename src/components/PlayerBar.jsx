import React from 'react';
import Icon from './Icon.jsx';
import { fmt } from '../theme.js';

function CB({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5, borderRadius: 6, transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
      {children}
    </button>
  );
}

export default function PlayerBar({
  T, C, song, audio,
  time, duration, progress,
  scrub, volScrub,
  prevSong, nextSong,
  liked, setLiked,
  shuffle, setShuffle,
  repeat, setRepeat,
  view, setView,
}) {
  return (
    <div style={{ height: 86, background: T.bar, borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px', flexShrink: 0, zIndex: 20 }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: T.text3, minWidth: 34, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(time)}</span>
        <div onClick={scrub} style={{ flex: 1, height: 3, background: T.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 2, cursor: 'pointer', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress * 100}%`, background: `linear-gradient(90deg,${C.light}cc,${C.accent}cc)`, borderRadius: 2, transition: 'width 0.15s linear', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: T.isDark ? '#fff' : T.text1, transition: 'left 0.15s linear', pointerEvents: 'none' }} />
        </div>
        <span style={{ fontSize: 11, color: T.text3, minWidth: 34, fontVariantNumeric: 'tabular-nums' }}>{fmt(duration)}</span>
      </div>
      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220 }}>
          <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <img src={song.art} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                 onError={e => { e.target.parentElement.style.background = C.bg3; e.target.style.display = 'none'; }} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{song.title}</div>
            <div style={{ fontSize: 11, color: T.text2 }}>{song.artist}</div>
          </div>
          <button onClick={() => setLiked(l => !l)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'transform 0.2s', transform: liked ? 'scale(1.2)' : 'scale(1)' }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill={liked ? C.accent : 'none'} stroke={liked ? C.accent : T.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <CB onClick={() => setShuffle(s => !s)} title="Shuffle"><Icon name="shuffle" size={17} color={shuffle ? C.accent : T.text3} /></CB>
          <CB onClick={prevSong} title="Previous"><Icon name="prev" size={20} color={T.text2} /></CB>
          <button onClick={audio.toggle} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', background: `linear-gradient(135deg,${C.light},${C.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 14px ${C.accent}44`, transition: 'transform 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <Icon name={audio.playing ? 'pause' : 'play'} size={18} color="#fff" />
          </button>
          <CB onClick={nextSong} title="Next"><Icon name="next" size={20} color={T.text2} /></CB>
          <CB onClick={() => setRepeat(r => !r)} title="Repeat"><Icon name="repeat" size={17} color={repeat ? C.accent : T.text3} /></CB>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220, justifyContent: 'flex-end' }}>
          <CB onClick={() => setView('player')} title="Lyrics"><Icon name="mic" size={15} color={view === 'player' ? C.accent : T.text3} /></CB>
          <CB title="Queue"><Icon name="queue" size={15} color={T.text3} /></CB>
          <CB title="Devices"><Icon name="device" size={15} color={T.text3} /></CB>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CB onClick={audio.toggleMute}><Icon name="vol" size={15} color={audio.muted ? C.accent : T.text3} /></CB>
            <div onClick={volScrub} style={{ width: 72, height: 3, background: T.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 2, cursor: 'pointer', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${audio.muted ? 0 : audio.volume}%`, background: T.text2, borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '50%', left: `${audio.muted ? 0 : audio.volume}%`, transform: 'translate(-50%,-50%)', width: 9, height: 9, borderRadius: '50%', background: T.text1 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
