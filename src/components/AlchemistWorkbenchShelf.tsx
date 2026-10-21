/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Flame, Droplet, Moon, Sun, Info } from 'lucide-react';
import { CharacterClass } from '../types/character';
import { soundFX } from '../utils/audio';

interface AlchemistWorkbenchShelfProps {
  onTransmuteWithEssence: (targetClass: CharacterClass) => void;
  isRolling: boolean;
}

interface ReagentVial {
  id: string;
  name: string;
  latinName: string;
  associatedClass: CharacterClass;
  color: string;
  glowColor: string;
  symbol: string;
  description: string;
  icon: React.ReactNode;
}

export const AlchemistWorkbenchShelf: React.FC<AlchemistWorkbenchShelfProps> = ({
  onTransmuteWithEssence,
  isRolling,
}) => {
  const [activeVialId, setActiveVialId] = useState<string | null>(null);
  const [showFormulaNotes, setShowFormulaNotes] = useState(false);

  const REAGENTS: ReagentVial[] = [
    {
      id: 'ignis',
      name: "Dragon's Blood Crucible",
      latinName: 'Crucibulum Ignis',
      associatedClass: 'Warrior',
      color: 'from-amber-600 via-rose-600 to-red-700',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      symbol: '🜂',
      description: 'Distilled brimstone and wyrm embers for iron constitution and martial power.',
      icon: <Flame className="w-3.5 h-3.5 text-amber-300" />,
    },
    {
      id: 'astrum',
      name: 'Celestial Quicksilver',
      latinName: 'Argentum Vivum Astralis',
      associatedClass: 'Mage',
      color: 'from-cyan-500 via-blue-600 to-indigo-800',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      symbol: '☿',
      description: 'Luminescent liquid stars tuned to weave high arcanum and temporal rifts.',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-200" />,
    },
    {
      id: 'umbra',
      name: 'Nightshade Venom Essence',
      latinName: 'Extractum Belladonnae',
      associatedClass: 'Rogue',
      color: 'from-emerald-500 via-teal-700 to-emerald-950',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      symbol: '🜍',
      description: 'Shadow-distilled mist conferring catlike grace and silent lethality.',
      icon: <Moon className="w-3.5 h-3.5 text-emerald-200" />,
    },
    {
      id: 'lux',
      name: 'Sunstone Auric Elixir',
      latinName: 'Elixir Aurum Solis',
      associatedClass: 'Paladin',
      color: 'from-amber-300 via-yellow-500 to-amber-700',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      symbol: '☉',
      description: 'Purified gold particulate infused with dawn benedictions and holy wrath.',
      icon: <Sun className="w-3.5 h-3.5 text-yellow-100" />,
    },
  ];

  const handleInfuse = (vial: ReagentVial) => {
    setActiveVialId(vial.id);
    soundFX.playPotionBubble();
    setTimeout(() => {
      onTransmuteWithEssence(vial.associatedClass);
      setTimeout(() => setActiveVialId(null), 600);
    }, 240);
  };

  return (
    <div className="w-full bg-[#140e0a]/90 border border-[#8a6839]/60 rounded-xl p-3.5 sm:p-4 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Antique Brass Shelf Mounts */}
      <div className="absolute top-0 left-6 w-2.5 h-2 bg-[#d4af37]/60 rounded-b" />
      <div className="absolute top-0 right-6 w-2.5 h-2 bg-[#d4af37]/60 rounded-b" />

      {/* Engraved Alchemical Workbench Plaque */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#785a32]/40">
        <div className="flex items-center gap-2.5">
          <span className="text-lg text-[#d4af37] font-fantasy">⚗</span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold-leaf font-fantasy-title flex items-center gap-2">
              <span>Alchemist&apos;s Reagent Rack</span>
              <span className="text-[10px] text-amber-200/50 normal-case font-serif tracking-normal">
                · Workbench Distillations
              </span>
            </h3>
            <p className="text-[11px] text-amber-200/60 hidden sm:block">
              Infuse an active catalyst vial below to bias the transmutation circle toward that discipline.
            </p>
          </div>
        </div>

        {/* Sigils bar & info toggle */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-2 text-[#d4af37]/70 font-mono tracking-wider select-none text-[11px]">
            <span>🜂 IGNIS</span>
            <span>·</span>
            <span>🜄 AQUA</span>
            <span>·</span>
            <span>🜁 AER</span>
            <span>·</span>
            <span>🜃 TERRA</span>
            <span>·</span>
            <span>🜎 LAPIS</span>
          </div>
          <button
            onClick={() => setShowFormulaNotes(!showFormulaNotes)}
            title="Toggle Alchemical Formula Notes"
            className="flex items-center gap-1 text-[11px] text-amber-200/70 hover:text-[#f7d58b] bg-[#221710] border border-[#785a32]/50 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <Info className="w-3 h-3 text-[#d4af37]" />
            <span>{showFormulaNotes ? 'Hide Formula' : 'Formula Guide'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Formula Guide */}
      {showFormulaNotes && (
        <div className="mt-3 p-3 bg-[#0d0907]/95 border border-[#8a6839]/40 rounded-lg text-xs text-amber-100/80 leading-relaxed font-serif animate-in fade-in duration-150">
          <p className="font-fantasy-title text-xs text-[#f7d58b] font-bold mb-1">
            Hermetic Principle of Transmutation:
          </p>
          <p>
            &ldquo;As the stars above align, so the mortal vessel within takes form. Select a reagent phial
            to infuse its elemental humor into the parchment matrix, drawing forth warriors of fire, mages
            of quicksilver, rogues of shadow, or paladins of auric dawn.&rdquo;
          </p>
        </div>
      )}

      {/* Interactive Reagents Vials Shelf */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
        {REAGENTS.map((vial) => {
          const isActive = activeVialId === vial.id;
          return (
            <button
              key={vial.id}
              onClick={() => handleInfuse(vial)}
              disabled={isRolling}
              title={`Infuse with ${vial.name} to transmute a ${vial.associatedClass}`}
              className={`group text-left p-2.5 rounded-lg border transition-all relative overflow-hidden cursor-pointer disabled:opacity-50 ${
                isActive
                  ? 'bg-[#2a1d13] border-[#f7d58b] shadow-lg scale-98'
                  : 'bg-[#120d09]/90 border-[#785a32]/50 hover:border-[#d4af37]/70 hover:bg-[#1c140d]'
              }`}
            >
              {/* Vial Shape and Glowing Liquid Container */}
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-10 shrink-0 flex flex-col items-center justify-end">
                  {/* Cork Stopper */}
                  <div className="w-3.5 h-1.5 bg-[#8a5d3b] rounded-t-xs border border-[#52331c] z-10" />
                  {/* Bottle Neck */}
                  <div className="w-2.5 h-2 bg-stone-300/20 border-x border-stone-400/40 z-10" />
                  {/* Glass Bulb Body */}
                  <div className="w-8 h-6.5 rounded-b-xl border border-stone-400/40 bg-stone-900/60 relative overflow-hidden flex items-end shadow-inner">
                    {/* Liquid fill with glow */}
                    <div
                      className={`w-full h-4.5 bg-gradient-to-t ${vial.color} opacity-85 transition-all duration-300 group-hover:h-5.5 ${
                        isActive ? 'animate-pulse' : ''
                      }`}
                      style={{
                        boxShadow: `0 0 10px ${vial.glowColor}`,
                      }}
                    />
                    {/* Glass glare highlight */}
                    <div className="absolute top-0 left-1 w-1 h-4 bg-white/30 rounded-full blur-[0.5px] pointer-events-none" />
                    {/* Tiny bubble */}
                    <div className="absolute bottom-1 right-2 w-1 h-1 rounded-full bg-white/60 animate-ping duration-1000" />
                  </div>
                </div>

                {/* Vial Metadata */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#d4af37]/80">{vial.symbol}</span>
                    <span className="text-[10px] font-semibold text-amber-200/50 group-hover:text-[#f7d58b] transition-colors">
                      {vial.associatedClass}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#f5ebd7] group-hover:text-gold-leaf transition-colors truncate font-fantasy">
                    {vial.name.split(' ')[0]}
                  </h4>
                  <p className="text-[9px] text-amber-200/40 italic font-serif truncate">
                    {vial.latinName}
                  </p>
                </div>
              </div>

              {/* Bottom Infuse action prompt */}
              <div className="mt-2 pt-1.5 border-t border-[#785a32]/30 flex items-center justify-between text-[10px] text-amber-200/60 group-hover:text-[#f7d58b]">
                <span className="flex items-center gap-1">
                  {vial.icon}
                  <span>Infuse Catalyst</span>
                </span>
                <span>⚡</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
