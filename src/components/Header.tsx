/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Header() {
  return (
    <header className="relative w-full h-[100dvh] text-slate-100 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center center' }}
      >
        <source
          src="/assets/BIGODEX_BARBEARIA_text_animation_202607172036.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
    </header>
  );
}
