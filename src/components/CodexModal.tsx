/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CharacterClass, CharacterRace } from '../types/character';
import { CLASSES, RACES } from '../data/fantasyData';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CodexModalProps {
  onSelectClassToRoll: (charClass: CharacterClass) => void;
  onSelectRaceToRoll: (race: CharacterRace) => void;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({
  onSelectClassToRoll,
  onSelectRaceToRoll,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'races'>('classes');

  const classList = Object.keys(CLASSES) as CharacterClass[];
  const raceList = Object.keys(RACES) as CharacterRace[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#140f0c] border border-[#8a6839]/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#785a32]/50 bg-[#0e0a07]/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-base font-bold text-gold-leaf font-fantasy-title">
              Alchemical Codex & Compendium
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Tab Controls */}
            <div className="flex items-center p-1 bg-[#0e0a07] border border-[#785a32]/50 rounded-lg">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('classes');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'classes'
                    ? 'bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] text-stone-950 font-bold shadow-sm'
                    : 'text-amber-200/70 hover:text-white'
                }`}
              >
                Disciplines ({classList.length})
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('races');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'races'
                    ? 'bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] text-stone-950 font-bold shadow-sm'
                    : 'text-amber-200/70 hover:text-white'
                }`}
              >
                Ancestries ({raceList.length})
              </button>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1.5 text-amber-200/60 hover:text-white rounded-lg hover:bg-[#251d16] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'classes' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classList.map((cName) => {
                const c = CLASSES[cName];
                return (
                  <div
                    key={cName}
                    className="p-4 rounded-xl border border-[#785a32]/50 bg-[#0e0a07]/85 hover:border-[#d4af37]/70 transition-all flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-[#f7d58b] font-fantasy-title">
                          {c.name}
                        </h3>
                        <span className="text-xs font-mono-numbers text-[#d4af37]">
                          d{c.hitDie} Hit Die
                        </span>
                      </div>
                      <p className="text-xs text-amber-300/80 font-medium mt-0.5">{c.role}</p>

                      <div className="text-xs text-amber-200/70 mt-2 space-y-1">
                        <div>
                          <span className="text-amber-200/50">Primary Stats:</span>{' '}
                          <span className="text-[#f5ebd7] font-medium font-fantasy">
                            {c.primaryStats.join(', ').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-amber-200/50">Subclasses:</span>{' '}
                          <span className="text-amber-100/90">{c.subclasses.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#785a32]/40 flex items-center justify-between">
                      <span className="text-[11px] text-amber-200/50">
                        {c.weapons[0]} · {c.armors[0]}
                      </span>
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onSelectClassToRoll(cName);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-[#f7d58b] hover:text-white transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Transmute {cName}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {raceList.map((rName) => {
                const r = RACES[rName];
                const bonuses = Object.entries(r.statBonus)
                  .map(([k, v]) => `+${v} ${k.slice(0, 3).toUpperCase()}`)
                  .join(', ');

                return (
                  <div
                    key={rName}
                    className="p-4 rounded-xl border border-[#785a32]/50 bg-[#0e0a07]/85 hover:border-[#d4af37]/70 transition-all flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-[#f7d58b] font-fantasy-title">
                          {r.name}
                        </h3>
                        <span className="text-xs font-mono-numbers text-amber-200/60">
                          {r.speed} ft speed
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#d4af37] mt-0.5">{r.trait}</p>
                      <p className="text-xs text-amber-100/80 mt-2 leading-relaxed font-serif">{r.description}</p>
                      <div className="text-xs text-amber-200/80 font-mono-numbers mt-2">
                        <span className="text-amber-200/50">Bonuses: </span>
                        {bonuses}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#785a32]/40 flex items-center justify-end">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onSelectRaceToRoll(rName);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-[#f7d58b] hover:text-white transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Transmute {rName}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
