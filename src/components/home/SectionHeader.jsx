import React from 'react';
import Icon from '../Icon.jsx';

export default function SectionHeader({ label, sub, link, T, F }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900, color: T.text1, fontFamily: F.heading, fontStyle: 'italic', letterSpacing: '-0.3px' }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: T.text3, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2, fontFamily: F.body }}>{sub}</div>}
      </div>
      {link && <div style={{ fontSize: 10, color: T.text3, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: F.body }}>{link} <Icon name="arrowright" size={10} color={T.text3} /></div>}
    </div>
  );
}
