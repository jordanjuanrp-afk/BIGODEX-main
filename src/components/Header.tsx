/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Header() {
  return (
    <header className="relative w-full h-[100dvh] text-slate-100 overflow-hidden bg-dark-bg flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-auto max-h-[100dvh] object-contain"
      >
        <source
          src="/assets/BIGODEX_BARBEARIA_text_animation_202607172036.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
    </header>
  );
}
