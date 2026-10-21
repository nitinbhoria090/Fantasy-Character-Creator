/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FantasyCharacter,
  CharacterStats,
} from '../types/character';
import {
  getStatModifier,
  formatModifier,
} from '../utils/characterGenerator';
import { getCharacterPortraitUrl } from '../utils/portraitService';
import {
  Shield,
  Heart,
  Zap,
  Footprints,
  Sparkles,
  BookmarkPlus,
  Check,
  Dices,
  Edit3,
  Copy,
  Sword,
  Scroll,
  Gamepad2,
  RotateCw,
  Palette,
  Layers,
  Flame,
  Award,
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CharacterCardProps {
  character: FantasyCharacter;
  onSaveToDeck: (character: FantasyCharacter) => void;
  isInDeck: boolean;
  onOpenDeckView?: () => void;
  deckCount?: number;
  onOpenDiceCheck: (statName: keyof CharacterStats, mod: number) => void;
  onOpenCustomizer: () => void;
  onRerollStats: () => void;
  onGenerateCartoonPortrait: () => void;
  onRegenerateCartoonPortrait: () => void;
  onTogglePortraitStyle: (style: 'painterly' | 'cartoon') => void;
  isGeneratingPortrait: boolean;
  onGenerateBackstory: () => void;
  isGeneratingBackstory: boolean;
  // Fallback props for backward compatibility
  onSaveToParty?: (character: FantasyCharacter) => void;
  isSavedInParty?: boolean;
}

const STAT_CONFIG: {
  key: keyof CharacterStats;
  label: string;
  short: string;
  description: string;
}[] = [
  { key: 'strength', label: 'Strength', short: 'STR', description: 'Physical power & athletic prowess' },
  { key: 'dexterity', label: 'Dexterity', short: 'DEX', description: 'Agility, reflexes & balance' },
  { key: 'constitution', label: 'Constitution', short: 'CON', description: 'Stamina, endurance & vital fortitude' },
  { key: 'intelligence', label: 'Intelligence', short: 'INT', description: 'Arcane lore, reason & memory' },
  { key: 'wisdom', label: 'Wisdom', short: 'WIS', description: 'Intuition, awareness & divine insight' },
  { key: 'charisma', label: 'Charisma', short: 'CHA', description: 'Force of personality & spellcraft' },
];

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSaveToDeck,
  isInDeck,
  onOpenDeckView,
  deckCount = 0,
  onOpenDiceCheck,
  onOpenCustomizer,
  onRerollStats,
  onGenerateCartoonPortrait,
  onRegenerateCartoonPortrait,
  onTogglePortraitStyle,
  isGeneratingPortrait,
  onGenerateBackstory,
  isGeneratingBackstory,
  onSaveToParty,
  isSavedInParty,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFoilSheen, setShowFoilSheen] = useState(false);

  const effectivePortraitUrl = getCharacterPortraitUrl(character);
  const isCartoon = character.portraitStyle === 'cartoon';

  // Stats: Health, Mana, Strength
  const cardHealth = character.health || character.hp || 100;
  const cardMana = character.mana || 50;
  const cardStrength = character.strength || character.stats.strength || 14;
  const cardRarity = character.cardRarity || 'Rare';

  const isSaved = isInDeck || isSavedInParty || false;
  const handleSaveToggle = () => {
    soundFX.playCardSave();
    if (onSaveToDeck) {
      onSaveToDeck(character);
    } else if (onSaveToParty) {
      onSaveToParty(character);
    }
  };

  // Copy full character sheet to clipboard
  const handleCopy = () => {
    soundFX.playClick();
    const statsText = STAT_CONFIG.map(
      (s) => `${s.short}: ${character.stats[s.key]} (${formatModifier(getStatModifier(character.stats[s.key]))})`
    ).join(' | ');

    const text = `
=== ${character.name.toUpperCase()} (PLAYER CARD) ===
${character.title}
Rarity: ${cardRarity} | Level ${character.level} ${character.race} ${character.class} (${character.subclass})
Alignment: ${character.alignment}

[Primary Player Card Stats]
Health (HP): ${cardHealth}
Mana (MP): ${cardMana}
Strength (STR): ${cardStrength}
Armor Class (AC): ${character.ac} | Speed: ${character.speed} ft | Initiative: ${formatModifier(character.initiative)}

[Attributes Matrix]
${statsText}

[Signature Ability]
${character.signatureAbility.name} (${character.signatureAbility.type})
${character.signatureAbility.description}
Cost/Damage: ${character.signatureAbility.costOrDamage}

[Equipment]
Weapon: ${character.gear.weapon}
Armor: ${character.gear.armor}
Relic: ${character.gear.wondrousItem}

[Origin Backstory]
${character.backstory}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <article
      aria-label={`${character.name} Player Card`}
      className="w-full player-card-frame rounded-2xl overflow-hidden transition-all duration-300 relative select-text"
    >
      {/* Antique Alchemical Brass Card Corner Accents */}
      <div className="card-corner-nw" />
      <div className="card-corner-ne" />
      <div className="card-corner-sw" />
      <div className="card-corner-se" />

      {/* Optional Foil Shimmer Overlay */}
      {showFoilSheen && <div className="absolute inset-0 card-foil-reflection z-30" />}

      {/* Top Card Rarity & Series Header Ribbon */}
      <div className="px-5 py-2.5 bg-gradient-to-r from-[#0d0906] via-[#1a130c] to-[#0d0906] border-b-2 border-[#b38947]/70 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#d4af37] text-sm select-none font-fantasy">❖</span>
          <span className="font-fantasy uppercase tracking-widest text-[#d4af37] text-[11px] font-bold">
            Alchemical Hero Card
          </span>
          <span className="text-[#785a32]">№</span>
          <span className="font-mono text-[11px] text-amber-200/70">{character.id.slice(-4).toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Card Rarity Badge */}
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider font-mono shadow ${
              cardRarity === 'Mythic'
                ? 'badge-rarity-mythic'
                : cardRarity === 'Legendary'
                ? 'badge-rarity-legendary'
                : cardRarity === 'Epic'
                ? 'badge-rarity-epic'
                : 'badge-rarity-rare'
            }`}
          >
            {cardRarity} Hero
          </span>

          {/* Level Badge */}
          <div className="bg-[#241a12] border border-[#d4af37]/60 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-[#f7d58b]">
            LVL {character.level}
          </div>

          {/* Foil effect toggle button */}
          <button
            onClick={() => setShowFoilSheen(!showFoilSheen)}
            title="Toggle card holographic foil sheen"
            className={`p-1 rounded text-[10px] border transition-colors cursor-pointer ${
              showFoilSheen
                ? 'bg-[#d4af37]/30 text-[#f7d58b] border-[#d4af37]'
                : 'bg-[#150f0a] text-amber-200/50 border-[#785a32]/40 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Column: Portrait, Name, Rarity & Core Orbs (5 cols) */}
        <div className="lg:col-span-5 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r-2 border-[#b38947]/60 bg-gradient-to-b from-[#16100c] to-[#0e0a07] p-5 md:p-6 space-y-5">
          {/* Portrait Window & Direct Generation Controls */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-[#b38947] bg-[#090705] shadow-2xl group">
              {!imageError ? (
                <img
                  src={effectivePortraitUrl}
                  alt={`${character.name} the ${character.class} (${isCartoon ? 'Cartoon Video Game Style' : 'Classic Style'})`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    isGeneratingPortrait ? 'scale-105 filter blur-[2px]' : ''
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#251d16] to-[#0f0c09] p-6 text-center">
                  <Shield className="w-16 h-16 text-[#d4af37]/80 mb-3" />
                  <p className="font-fantasy-title text-xl text-[#f7d58b] font-semibold">{character.name}</p>
                  <p className="text-xs text-[#d4af37] mt-1">{character.class}</p>
                </div>
              )}

              {/* Loading generation overlay */}
              {isGeneratingPortrait && (
                <div className="absolute inset-0 bg-[#0d0a07]/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 animate-in fade-in duration-200">
                  <Sparkles className="w-9 h-9 text-[#f7d58b] animate-spin mb-2" />
                  <p className="text-sm font-fantasy-title font-bold text-[#f7d58b]">
                    {isCartoon ? 'Transmuting Game Portrait...' : 'Distilling Cartoon Essence...'}
                  </p>
                  <p className="text-[11px] text-amber-200/70 mt-0.5">
                    Rendering on player card frame
                  </p>
                </div>
              )}

              {/* Class Emblem & Style Overlays */}
              <div className="absolute top-3 left-3 bg-[#120e0a]/90 backdrop-blur-md border border-[#8a6839]/70 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: character.accentColor }} />
                <span className="text-xs font-semibold text-[#f5ebd7] tracking-wide">{character.class}</span>
              </div>

              <div className="absolute top-3 right-3 bg-[#120e0a]/90 backdrop-blur-md border border-[#8a6839]/70 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-md">
                {isCartoon ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#f7d58b]">
                    <Gamepad2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Cartoon Art</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-200/80">
                    <Palette className="w-3.5 h-3.5 text-[#b48a4b]" />
                    <span>Classic</span>
                  </span>
                )}
              </div>
            </div>

            {/* Portrait Generation & Regeneration Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-0.5">
              {!isCartoon ? (
                <button
                  onClick={() => onGenerateCartoonPortrait()}
                  disabled={isGeneratingPortrait}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] hover:from-[#f3cf65] hover:to-[#c59b5c] rounded-lg shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Gamepad2 className="w-4 h-4 text-stone-950" />
                  <span>Generate Cartoon / Game Portrait</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onRegenerateCartoonPortrait()}
                    disabled={isGeneratingPortrait}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] hover:from-[#f3cf65] hover:to-[#c59b5c] rounded-lg shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 text-stone-950 ${isGeneratingPortrait ? 'animate-spin' : ''}`} />
                    <span>Regenerate Portrait</span>
                  </button>

                  <button
                    onClick={() => onTogglePortraitStyle('painterly')}
                    disabled={isGeneratingPortrait}
                    title="Switch back to classic painterly art"
                    className="px-3 py-2 text-xs font-medium text-amber-200 bg-[#221a14] hover:bg-[#2d221a] border border-[#785a32]/60 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5 text-[#b48a4b]" />
                    <span>Classic</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Character Name in Stylized Fantasy Font */}
          <div className="relative border-t border-b border-[#8a6839]/40 py-3 bg-[#110c09]/60 px-2 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] text-[#d4af37]/80 uppercase tracking-widest font-mono">
                {character.race} • {character.class}
              </span>
              <span className="text-[10px] text-amber-200/60 font-mono">
                {character.alignment}
              </span>
            </div>

            <div className="flex items-center gap-2 my-1">
              <span className="text-[#d4af37] text-base select-none font-fantasy">❖</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-gold-leaf-illuminated font-fantasy-name leading-tight flex-1">
                {character.name}
              </h1>
              <span className="text-[#d4af37] text-base select-none font-fantasy">❖</span>
            </div>

            <p className="text-xs font-medium text-amber-300/90 italic mt-0.5 font-serif">
              &ldquo;{character.title}&rdquo;
            </p>
          </div>

          {/* =========================================================================
              THE 3 NEW RANDOMLY GENERATED PLAYER CARD STATS: Health, Mana, Strength
              ========================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#d4af37] font-fantasy font-bold uppercase tracking-wider px-1">
              <span>Primary Card Stats</span>
              <button
                onClick={() => {
                  soundFX.playDiceRoll();
                  onRerollStats();
                }}
                className="text-[11px] text-[#f7d58b] hover:underline flex items-center gap-1 font-mono cursor-pointer"
              >
                <Dices className="w-3 h-3" />
                <span>Reroll Stats</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* 1. HEALTH STAT ORB */}
              <div
                title="Randomly generated Health pool based on class & constitution fortitude"
                className="stat-orb-health rounded-xl p-3 text-center flex flex-col items-center justify-center text-white transition-transform hover:scale-102 cursor-default"
              >
                <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-100">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>HEALTH</span>
                </div>
                <div className="text-2xl md:text-3xl font-black font-mono-numbers my-0.5 leading-none tracking-tight">
                  {cardHealth}
                </div>
                <div className="text-[10px] text-rose-200/90 font-medium">HP Vitality</div>
              </div>

              {/* 2. MANA STAT ORB */}
              <div
                title="Randomly generated Mana pool based on arcane affinity & wisdom"
                className="stat-orb-mana rounded-xl p-3 text-center flex flex-col items-center justify-center text-white transition-transform hover:scale-102 cursor-default"
              >
                <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-sky-100">
                  <Zap className="w-4 h-4 fill-white" />
                  <span>MANA</span>
                </div>
                <div className="text-2xl md:text-3xl font-black font-mono-numbers my-0.5 leading-none tracking-tight">
                  {cardMana}
                </div>
                <div className="text-[10px] text-sky-200/90 font-medium">MP Arcana</div>
              </div>

              {/* 3. STRENGTH STAT ORB */}
              <div
                title="Randomly generated Strength score representing raw physical power"
                className="stat-orb-strength rounded-xl p-3 text-center flex flex-col items-center justify-center text-stone-950 transition-transform hover:scale-102 cursor-default"
              >
                <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-stone-900">
                  <Sword className="w-4 h-4" />
                  <span>STRENGTH</span>
                </div>
                <div className="text-2xl md:text-3xl font-black font-mono-numbers my-0.5 leading-none tracking-tight">
                  {cardStrength}
                </div>
                <div className="text-[10px] text-stone-900 font-bold">STR Power</div>
              </div>
            </div>
          </div>

          {/* Secondary Vitals Ribbon (AC, SPD, INIT) */}
          <div className="grid grid-cols-3 gap-2 bg-[#120d09]/90 border border-[#785a32]/50 p-2 rounded-xl text-center">
            <div>
              <div className="text-[10px] text-sky-300 font-semibold flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                <span>ARMOR</span>
              </div>
              <div className="text-sm font-bold font-mono-numbers text-[#f5ebd7]">{character.ac} AC</div>
            </div>

            <div className="border-x border-[#785a32]/40">
              <div className="text-[10px] text-emerald-300 font-semibold flex items-center justify-center gap-1">
                <Footprints className="w-3 h-3" />
                <span>SPEED</span>
              </div>
              <div className="text-sm font-bold font-mono-numbers text-[#f5ebd7]">{character.speed} ft</div>
            </div>

            <div>
              <div className="text-[10px] text-[#f7d58b] font-semibold flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>INITIATIVE</span>
              </div>
              <div className="text-sm font-bold font-mono-numbers text-[#f5ebd7]">{formatModifier(character.initiative)}</div>
            </div>
          </div>

          {/* Primary Action: Save to Deck & Deck Access */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2">
            <button
              onClick={handleSaveToggle}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg active:scale-98 ${
                isSaved
                  ? 'bg-gradient-to-r from-emerald-800 to-emerald-950 text-emerald-100 border-2 border-emerald-500/70 shadow-emerald-950/50'
                  : 'bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#aa8029] text-stone-950 font-black hover:brightness-110 border-2 border-[#fff2a3] shadow-amber-500/20'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Layers className="w-4 h-4 text-stone-950" />}
              <span>{isSaved ? 'Saved in My Deck' : 'Save to Deck'}</span>
            </button>

            {onOpenDeckView && (
              <button
                onClick={() => {
                  soundFX.playCardDraw();
                  onOpenDeckView();
                }}
                className="px-3.5 py-2.5 text-xs font-semibold text-amber-200 bg-[#1c140d] hover:bg-[#251c13] border-2 border-[#785a32]/70 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>My Deck ({deckCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Abilities, Backstory with Generator, Gear & Attributes (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-5 md:p-6 space-y-5 bg-[#140e0a]/90">
          {/* Racial Heritage & Origin Backstory Section with 'Generate Backstory' Button */}
          <div className="bg-[#100c09]/90 border-2 border-[#8a6839]/60 p-4 rounded-xl relative shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 font-fantasy">
                <Scroll className="w-4 h-4 text-[#d4af37]" />
                <span>Card Origin & Backstory Lore</span>
              </h2>

              {/* Generate Backstory Button */}
              <button
                onClick={onGenerateBackstory}
                disabled={isGeneratingBackstory}
                title="Generate a unique, 1-to-2-sentence origin story for this character"
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] hover:from-[#f3cf65] hover:to-[#c59b5c] rounded-lg shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 text-stone-950 ${isGeneratingBackstory ? 'animate-spin' : ''}`} />
                <span>{isGeneratingBackstory ? 'Inscribing Story...' : 'Generate Backstory'}</span>
              </button>
            </div>

            {/* Backstory Display Container */}
            <div className="relative min-h-[50px] bg-[#17110d]/80 p-3 rounded-lg border border-[#785a32]/40">
              <p
                className={`text-xs text-amber-100/90 leading-relaxed italic font-serif transition-opacity duration-300 ${
                  isGeneratingBackstory ? 'opacity-30 filter blur-[0.5px]' : 'opacity-100'
                }`}
              >
                &ldquo;{character.backstory}&rdquo;
              </p>

              {/* Loading Inscription Overlay */}
              {isGeneratingBackstory && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#100c09]/80 backdrop-blur-xs rounded-lg">
                  <div className="flex items-center gap-2 text-xs font-fantasy font-semibold text-[#f7d58b]">
                    <Sparkles className="w-4 h-4 text-[#d4af37] animate-spin" />
                    <span>Inscribing unique 1-2 sentence origin tale...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-[#785a32]/40 text-[11px] text-amber-200/60">
              <div className="flex items-center gap-1.5">
                <span className="text-[#f7d58b] font-medium font-fantasy">Ancestral Trait:</span>
                <span>{character.traits[0]}</span>
              </div>
              <span className="text-[10px] text-amber-200/50 font-mono tracking-wider">
                1–2 Sentence Chronicle
              </span>
            </div>
          </div>

          {/* Card Signature Ability Section */}
          <div className="bg-[#100c09]/90 border border-[#8a6839]/60 p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#d4af37]" />
                <h2 className="text-sm font-bold text-[#f7d58b] font-fantasy">
                  {character.signatureAbility.name}
                </h2>
              </div>
              <span className="text-xs font-mono-numbers text-[#f7d58b] font-semibold bg-[#251d16] px-2 py-0.5 rounded border border-[#785a32]/60">
                {character.signatureAbility.costOrDamage}
              </span>
            </div>
            <p className="text-xs text-amber-100/80 mt-1">
              <span className="text-[#f5ebd7] font-semibold">{character.signatureAbility.type}</span>
              <span aria-hidden="true"> · </span>
              {character.signatureAbility.description}
            </p>
          </div>

          {/* Attributes Matrix with Interactive Dice Checks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 font-fantasy">
                <span>Core Ability Attributes (d20 Matrix)</span>
              </h2>
              <span className="text-[11px] text-amber-200/50 font-mono">
                Click any score to roll check
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STAT_CONFIG.map(({ key, short, label }) => {
                const score = character.stats[key];
                const mod = getStatModifier(score);
                const percent = Math.min(100, Math.max(15, (score / 20) * 100));

                return (
                  <button
                    key={key}
                    onClick={() => {
                      soundFX.playDiceRoll();
                      onOpenDiceCheck(key, mod);
                    }}
                    title={`Click to roll a d20 test for ${label} (${formatModifier(mod)})`}
                    className="group text-left bg-[#0f0b08]/90 hover:bg-[#1c150f] border border-[#785a32]/50 hover:border-[#d4af37] p-2.5 rounded-xl transition-all relative overflow-hidden shadow-inner cursor-pointer"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-amber-200/80 group-hover:text-[#f7d58b] transition-colors font-fantasy">
                        {short}
                      </span>
                      <span className="text-xs font-mono-numbers font-semibold text-[#f7d58b]">
                        {formatModifier(mod)}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold font-mono-numbers text-[#f5ebd7]">
                        {score}
                      </span>
                      <span className="text-[10px] text-amber-200/50 truncate">{label}</span>
                    </div>

                    <div className="w-full bg-[#201812] h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: character.accentColor || '#d4af37',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipped Loadout & Wondrous Relic */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2 flex items-center gap-1.5 font-fantasy">
              <Sword className="w-3.5 h-3.5" />
              <span>Card Armory & Wondrous Relics</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#100c09]/90 border border-[#785a32]/50 p-2.5 rounded-lg">
                <span className="text-[10px] text-amber-200/50 block">Weapon</span>
                <span className="font-medium text-[#f5ebd7] mt-0.5 block truncate">
                  {character.gear.weapon}
                </span>
              </div>
              <div className="bg-[#100c09]/90 border border-[#785a32]/50 p-2.5 rounded-lg">
                <span className="text-[10px] text-amber-200/50 block">Armor</span>
                <span className="font-medium text-[#f5ebd7] mt-0.5 block truncate">
                  {character.gear.armor}
                </span>
              </div>
              <div className="bg-[#100c09]/90 border border-[#785a32]/50 p-2.5 rounded-lg">
                <span className="text-[10px] text-amber-200/50 block">Relic</span>
                <span className="font-medium text-[#f7d58b] mt-0.5 block truncate">
                  {character.gear.wondrousItem}
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer Quick Actions */}
          <div className="pt-2 border-t border-[#8a6839]/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                title="Copy Card text to clipboard"
                className="px-3 py-1.5 text-xs font-medium text-amber-200 bg-[#1e1711] hover:bg-[#281f17] border border-[#785a32]/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Card'}</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenCustomizer();
                }}
                title="Edit character folio details"
                className="px-3 py-1.5 text-xs font-medium text-amber-200 bg-[#1e1711] hover:bg-[#281f17] border border-[#785a32]/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Card</span>
              </button>
            </div>

            <div className="text-[11px] text-amber-200/50 font-serif italic hidden sm:block">
              Preserved in Ancient Alchemist Folio
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
