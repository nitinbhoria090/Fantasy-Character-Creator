/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FantasyCharacter,
  CharacterClass,
  CharacterRace,
  Alignment,
  CharacterStats,
} from '../types/character';
import { CLASSES, RACES, ALIGNMENTS } from '../data/fantasyData';
import { X, Check } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { getStatModifier } from '../utils/characterGenerator';

interface CharacterCustomizerModalProps {
  character: FantasyCharacter;
  onSave: (updated: FantasyCharacter) => void;
  onClose: () => void;
}

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  character,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(character.name);
  const [title, setTitle] = useState(character.title);
  const [charClass, setCharClass] = useState<CharacterClass>(character.class);
  const [race, setRace] = useState<CharacterRace>(character.race);
  const [alignment, setAlignment] = useState<Alignment>(character.alignment);
  const [level, setLevel] = useState<number>(character.level);
  const [health, setHealth] = useState<number>(character.health || character.hp || 100);
  const [mana, setMana] = useState<number>(character.mana || 50);
  const [strength, setStrength] = useState<number>(character.strength || character.stats.strength || 14);
  const [backstory, setBackstory] = useState(character.backstory);
  const [stats, setStats] = useState<CharacterStats>({ ...character.stats });

  const classList = Object.keys(CLASSES) as CharacterClass[];
  const raceList = Object.keys(RACES) as CharacterRace[];

  const handleStatChange = (key: keyof CharacterStats, delta: number) => {
    soundFX.playClick();
    setStats((prev) => ({
      ...prev,
      [key]: Math.min(20, Math.max(3, prev[key] + delta)),
    }));
  };

  const handleSave = () => {
    soundFX.playClick();
    const classDef = CLASSES[charClass];
    const raceDef = RACES[race];

    // Recompute combat vitals
    const conMod = getStatModifier(stats.constitution);
    const dexMod = getStatModifier(stats.dexterity);

    let baseAc = 10 + dexMod;
    if (charClass === 'Warrior' || charClass === 'Paladin') {
      baseAc = 18;
    } else if (charClass === 'Rogue' || charClass === 'Ranger') {
      baseAc = 14 + Math.min(3, Math.max(0, dexMod));
    } else if (charClass === 'Mage') {
      baseAc = 12 + dexMod;
    }

    const updated: FantasyCharacter = {
      ...character,
      name: name.trim() || character.name,
      title: title.trim() || character.title,
      class: charClass,
      race,
      alignment,
      level,
      hp: health,
      health,
      maxHealth: health,
      mana,
      maxMana: mana,
      strength,
      ac: baseAc,
      initiative: dexMod,
      stats: {
        ...stats,
        strength: Math.min(20, Math.max(3, strength)),
      },
      backstory,
      portraitUrl: classDef.portraitUrl,
      portraitStyle: character.portraitStyle || 'painterly',
      portraitSeed: character.portraitSeed || 0,
      cartoonPortraitUrl: character.cartoonPortraitUrl,
      themeColor: classDef.themeColor,
      accentColor: classDef.accentColor,
      cardRarity: character.cardRarity || 'Rare',
      traits: [raceDef.trait, `${classDef.name} Specialty: ${character.subclass}`],
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#140f0c] border border-[#8a6839]/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#785a32]/50 bg-[#0e0a07]/80">
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] font-fantasy">⚗</span>
            <h2 className="text-base font-bold text-gold-leaf font-fantasy-title">
              Inscribe Alchemical Folio
            </h2>
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1 font-fantasy">
                Hero Name (Stylized Fantasy)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#0e0a07] border border-[#785a32]/60 rounded-lg text-[#f7d58b] font-fantasy-name focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1 font-fantasy">
                Title / Epithet
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#0e0a07] border border-[#785a32]/60 rounded-lg text-[#f5ebd7] italic font-serif focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Class, Race & Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1 font-fantasy">
                Class Arcana
              </label>
              <select
                value={charClass}
                onChange={(e) => setCharClass(e.target.value as CharacterClass)}
                className="w-full px-3 py-2 text-sm bg-[#0e0a07] border border-[#785a32]/60 rounded-lg text-[#f5ebd7] focus:outline-none focus:border-[#d4af37]"
              >
                {classList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1 font-fantasy">
                Race / Ancestry
              </label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value as CharacterRace)}
                className="w-full px-3 py-2 text-sm bg-[#0e0a07] border border-[#785a32]/60 rounded-lg text-[#f5ebd7] focus:outline-none focus:border-[#d4af37]"
              >
                {raceList.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-amber-200/80 block mb-1 font-fantasy">
                Alignment
              </label>
              <select
                value={alignment}
                onChange={(e) => setAlignment(e.target.value as Alignment)}
                className="w-full px-3 py-2 text-sm bg-[#0e0a07] border border-[#785a32]/60 rounded-lg text-[#f5ebd7] focus:outline-none focus:border-[#d4af37]"
              >
                {ALIGNMENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Level slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-amber-200/80 mb-1 font-fantasy">
              <span>Experience Level</span>
              <span className="font-mono-numbers text-[#f7d58b] font-bold">Level {level}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
          </div>

          {/* Primary Player Card Stats: Health, Mana, Strength */}
          <div>
            <label className="text-xs font-semibold text-[#d4af37] block mb-2 font-fantasy">
              Primary Card Stats (Health, Mana, Strength)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#0e0a07] border border-rose-900/50 rounded-lg">
                <span className="text-[11px] font-bold text-rose-300 block mb-1">❤️ Health</span>
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={health}
                  onChange={(e) => setHealth(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2 py-1 bg-[#18120d] border border-rose-800/50 rounded text-rose-100 font-mono text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="p-3 bg-[#0e0a07] border border-sky-900/50 rounded-lg">
                <span className="text-[11px] font-bold text-sky-300 block mb-1">🔷 Mana</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={mana}
                  onChange={(e) => setMana(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2 py-1 bg-[#18120d] border border-sky-800/50 rounded text-sky-100 font-mono text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="p-3 bg-[#0e0a07] border border-amber-900/50 rounded-lg">
                <span className="text-[11px] font-bold text-amber-300 block mb-1">⚔️ Strength</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={strength}
                  onChange={(e) => setStrength(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2 py-1 bg-[#18120d] border border-amber-800/50 rounded text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Attributes fine-tuning */}
          <div>
            <label className="text-xs font-semibold text-amber-200/80 block mb-2 font-fantasy">
              Attribute Distillations (3 - 20)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as (keyof CharacterStats)[]).map(
                (key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2.5 bg-[#0e0a07] border border-[#785a32]/50 rounded-lg"
                  >
                    <span className="text-xs uppercase font-bold text-amber-200/70 font-fantasy">
                      {key.slice(0, 3)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatChange(key, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-[#251d16] hover:bg-[#34281e] text-amber-200 text-xs rounded border border-[#785a32]/40 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono-numbers font-bold text-[#f7d58b] text-sm w-6 text-center">
                        {stats[key]}
                      </span>
                      <button
                        onClick={() => handleStatChange(key, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-[#251d16] hover:bg-[#34281e] text-amber-200 text-xs rounded border border-[#785a32]/40 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Lore Backstory text */}
          <div>
            <label className="text-xs font-semibold text-amber-200/80 block mb-1 font-fantasy">
              Alchemist Folio Lore / Backstory
            </label>
            <textarea
              rows={3}
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#0e0a07] border border-[#785a32]/60 rounded-lg text-amber-100/90 focus:outline-none focus:border-[#d4af37] leading-relaxed font-serif"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#785a32]/50 bg-[#0e0a07]/80">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-amber-200/70 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] hover:from-[#f3cf65] hover:to-[#c59b5c] rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Folio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
