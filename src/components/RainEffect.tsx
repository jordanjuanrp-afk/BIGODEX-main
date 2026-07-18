/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';

interface RainDrop {
  id: number;
  left: string;
  delay: string;
  duration: string;
  opacity: number;
  width: number;
  height: number;
}

export default function RainEffect() {
  const drops = useMemo(() => {
    const result: RainDrop[] = [];
    for (let i = 0; i < 80; i++) {
      result.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${0.8 + Math.random() * 1.2}s`,
        opacity: 0.15 + Math.random() * 0.35,
        width: 1.5 + Math.random() * 2,
        height: 25 + Math.random() * 40,
      });
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: drop.left,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animation: `rain-fall ${drop.duration} ${drop.delay} linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
