import React from 'react';
import { ICONS } from '../theme.js';

export default function Icon({ name, size = 16, color = 'currentColor', onClick, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         onClick={onClick}
         style={{ cursor: onClick ? 'pointer' : 'default', flexShrink: 0, ...style }}>
      <path d={ICONS[name] || ''} />
    </svg>
  );
}
