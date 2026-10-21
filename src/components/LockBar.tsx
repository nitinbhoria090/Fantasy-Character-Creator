/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, Unlock, Dices, RotateCcw, Gamepad2 } from 'lucide-react';
import { CharacterClass, LockSettings } from '../types/character';
import { CLASSES } from '../data/fantasyData';
import { soundFX } from '../utils/audio';

interface LockBarProps {
  locks: LockSettings;
  onToggleLock: (key: keyof LockSettings) => void;
  selectedClassFilter: CharacterClass | 'ANY';
  onSelectClassFilter: (val: CharacterClass | 'ANY') => void;
  onGenerate: () => void;
  onResetLocks: () => void;
  isRolling: boolean;
  isCartoonPortrait: boolean;
  onToggleCartoonPortrait: () => void;
}

export const LockBar: React.FC<LockBarProps> = ({
  locks,
  onToggleLock,
  selectedClassFilter,
  onSelectClassFilter,
  onGenerate,
  onResetLocks,
  isRolling,
  isCartoonPortrait,
  onToggleCartoonPortrait,
}) => {
  const classList = Object.keys(CLASSES) as CharacterClass[];
  const hasActiveLocks = Object.values(locks).some(Boolean);

  return (
    <div className="w-full bg-[#140f0c]/92 border border-[#8a6839]/50 rounded-xl p-4 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Class Filter Selection */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]/80 whitespace-nowrap shrink-0 font-fantasy">
            Transmutation Class:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => {
                soundFX.playClick();
                onSelectClassFilter('ANY');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedClassFilter === 'ANY'
                  ? 'bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] text-stone-950 font-bold shadow-md'
                  : 'bg-[#221a14]/80 text-amber-200/80 hover:text-[#f7d58b] hover:bg-[#2d221a] border border-[#785a32]/40'
              }`}
            >
              All Arcana
            </button>
            {classList.map((c) => (
              <button
                key={c}
                onClick={() => {
                  soundFX.playClick();
                  onSelectClassFilter(c);
                }}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedClassFilter === c
                    ? 'bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] text-stone-950 font-bold shadow-md'
                    : 'bg-[#221a14]/80 text-amber-200/80 hover:text-[#f7d58b] hover:bg-[#2d221a] border border-[#785a32]/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Lock Controls & Master Roll Button */}
        <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#785a32]/30">
          <div className="flex items-center gap-1.5 bg-[#0e0a07]/80 p-1 rounded-lg border border-[#785a32]/50 shadow-inner">
            <span className="text-xs text-amber-200/60 px-2 font-medium">Preserve:</span>

            {(['name', 'class', 'race', 'stats'] as (keyof LockSettings)[]).map((key) => {
              const isLocked = locks[key];
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <button
                  key={key}
                  onClick={() => {
                    soundFX.playClick();
                    onToggleLock(key);
                  }}
                  title={isLocked ? `Unlock ${label}` : `Lock ${label} across transmutations`}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    isLocked
                      ? 'bg-[#d4af37]/25 text-[#f7d58b] border border-[#d4af37]/60'
                      : 'text-amber-200/60 hover:text-amber-100 hover:bg-[#221a14]'
                  }`}
                >
                  {isLocked ? <Lock className="w-3 h-3 text-[#f7d58b]" /> : <Unlock className="w-3 h-3 text-amber-200/40" />}
                  <span>{label}</span>
                </button>
              );
            })}

            {hasActiveLocks && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onResetLocks();
                }}
                title="Unlock all fields"
                className="p-1 text-amber-400 hover:text-red-400 transition-colors ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onToggleCartoonPortrait();
            }}
            title="Toggle cartoon/video game portrait mode for character"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
              isCartoonPortrait
                ? 'bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] text-stone-950 font-bold shadow-md'
                : 'bg-[#221a14]/80 text-amber-200/80 border border-[#785a32]/50 hover:text-[#f7d58b] hover:border-[#d4af37]/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{isCartoonPortrait ? 'Cartoon Art ON' : 'Cartoon Art'}</span>
          </button>

          <button
            onClick={() => {
              onGenerate();
            }}
            disabled={isRolling}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-stone-950 bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] hover:from-[#f3cf65] hover:to-[#c59b5c] rounded-lg shadow-xl shadow-amber-500/10 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${
              isRolling ? 'opacity-80 animate-pulse' : ''
            }`}
          >
            <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Transmuting...' : 'Roll Character'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
