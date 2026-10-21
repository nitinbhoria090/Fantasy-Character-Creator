/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Volume2, VolumeX, Layers, Dices, BookOpen } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface TopNavProps {
  onGenerate: () => void;
  onOpenDeck: () => void;
  onOpenDiceRoller: () => void;
  onOpenCodex: () => void;
  deckCount: number;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onGenerate,
  onOpenDeck,
  onOpenDiceRoller,
  onOpenCodex,
  deckCount,
  isMuted,
  onToggleSound,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-[#8a6839]/40 bg-[#0e0a07]/90 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onGenerate();
          }}
          className="text-xl font-bold tracking-wide text-gold-leaf font-fantasy-title whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors flex items-center gap-2"
        >
          <span className="text-[#d4af37] text-lg">🎴</span>
          <span>Alchemy of Heroes</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-200/80">
        <button
          onClick={() => {
            soundFX.playClick();
            onGenerate();
          }}
          className="hover:text-[#f7d58b] transition-colors whitespace-nowrap shrink-0 text-amber-200/80"
        >
          Player Card Workbench
        </button>
        <button
          onClick={() => {
            soundFX.playCardDraw();
            onOpenDeck();
          }}
          className="hover:text-[#f7d58b] transition-colors whitespace-nowrap shrink-0 text-amber-200/80 flex items-center gap-1.5"
        >
          <Layers className="w-4 h-4 text-[#d4af37]" />
          <span className="font-bold text-[#f7d58b]">My Deck</span>
          <span className="font-mono-numbers text-xs font-bold px-2 py-0.5 rounded-full bg-[#251d16] text-[#f7d58b] border border-[#785a32]/60">
            {deckCount}
          </span>
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            onOpenDiceRoller();
          }}
          className="hover:text-[#f7d58b] transition-colors whitespace-nowrap shrink-0 text-amber-200/80 flex items-center gap-1.5"
        >
          <Dices className="w-4 h-4 text-[#b48a4b]" />
          <span>Dice Divination</span>
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            onOpenCodex();
          }}
          className="hover:text-[#f7d58b] transition-colors whitespace-nowrap shrink-0 text-amber-200/80 flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4 text-[#b48a4b]" />
          <span>Alchemical Codex</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action + sound toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSound}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 text-amber-300/80 hover:text-[#f7d58b] bg-[#1a140f] border border-[#785a32]/60 rounded-lg transition-colors cursor-pointer"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-950 bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] hover:from-[#f3cf65] hover:to-[#c59b5c] rounded-lg shadow-lg hover:shadow-amber-500/20 active:scale-98 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-stone-950" />
          <span>Transmute Character</span>
        </button>
      </div>
    </header>
  );
};
