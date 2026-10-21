/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { FantasyCharacter, CharacterClass, CharacterRace, LockSettings, CharacterStats } from './types/character';
import { createRandomCharacter } from './utils/characterGenerator';
import {
  generateCartoonPortrait,
  regeneratePortrait,
  getCharacterPortraitUrl,
} from './utils/portraitService';
import { generateCharacterBackstory } from './utils/backstoryGenerator';
import { soundFX } from './utils/audio';
import { TopNav } from './components/TopNav';
import { AlchemistWorkbenchShelf } from './components/AlchemistWorkbenchShelf';
import { LockBar } from './components/LockBar';
import { CharacterCard } from './components/CharacterCard';
import { MyDeckView } from './components/MyDeckView';
import { DiceRollerModal } from './components/DiceRollerModal';
import { CharacterCustomizerModal } from './components/CharacterCustomizerModal';
import { CodexModal } from './components/CodexModal';
import { Dices, Sparkles, BookOpen, Layers, Heart, Zap, Sword, Check } from 'lucide-react';

const DECK_STORAGE_KEY = 'alchemist_player_deck_v2';
const LEGACY_PARTY_KEY = 'fantasy_party_roster_v1';

export default function App() {
  const [character, setCharacter] = useState<FantasyCharacter>(() => createRandomCharacter());
  const [locks, setLocks] = useState<LockSettings>({
    name: false,
    class: false,
    race: false,
    stats: false,
  });
  const [selectedClassFilter, setSelectedClassFilter] = useState<CharacterClass | 'ANY'>('ANY');

  // Deck state with localStorage persistence and legacy migration
  const [deck, setDeck] = useState<FantasyCharacter[]>(() => {
    try {
      const savedDeck = localStorage.getItem(DECK_STORAGE_KEY);
      if (savedDeck) {
        return JSON.parse(savedDeck);
      }
      // Migrate from legacy party roster if present
      const legacyParty = localStorage.getItem(LEGACY_PARTY_KEY);
      if (legacyParty) {
        const parsed: any[] = JSON.parse(legacyParty);
        return parsed.map((item) => ({
          ...item,
          health: item.health || item.hp || 120,
          maxHealth: item.maxHealth || item.hp || 120,
          mana: item.mana || 80,
          maxMana: item.maxMana || 80,
          strength: item.strength || item.stats?.strength || 16,
          cardRarity: item.cardRarity || 'Rare',
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isRolling, setIsRolling] = useState(false);
  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [deckToast, setDeckToast] = useState<string | null>(null);
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);
  const [diceParams, setDiceParams] = useState<{ die: number; mod: number; statName?: string }>({
    die: 20,
    mod: 0,
  });
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFX.isMuted);
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);

  // Sync deck to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
    } catch {
      // storage unavailable
    }
  }, [deck]);

  // Main generator trigger
  const handleGenerate = useCallback(
    (forcedClass?: CharacterClass, forcedRace?: CharacterRace) => {
      soundFX.playDiceRoll();
      setIsRolling(true);

      const targetClass = forcedClass || (selectedClassFilter !== 'ANY' ? selectedClassFilter : undefined);

      setTimeout(() => {
        const nextChar = createRandomCharacter(character, locks, targetClass, forcedRace);
        setCharacter(nextChar);
        setIsRolling(false);
        soundFX.playCharacterSummon();
      }, 220);
    },
    [character, locks, selectedClassFilter]
  );

  const handleToggleLock = (key: keyof LockSettings) => {
    setLocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetLocks = () => {
    setLocks({ name: false, class: false, race: false, stats: false });
  };

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  // 'Save to Deck' feature
  const handleSaveToDeck = (char: FantasyCharacter) => {
    setDeck((prev) => {
      const exists = prev.some((c) => c.id === char.id);
      if (exists) {
        soundFX.playClick();
        setDeckToast(`Removed "${char.name}" from My Deck`);
        setTimeout(() => setDeckToast(null), 2400);
        return prev.filter((c) => c.id !== char.id);
      }
      soundFX.playCardSave();
      setDeckToast(`Saved "${char.name}" to My Deck!`);
      setTimeout(() => setDeckToast(null), 2400);
      return [char, ...prev];
    });
  };

  const handleRemoveFromDeck = (id: string) => {
    setDeck((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSelectFromDeck = (char: FantasyCharacter) => {
    setCharacter(char);
    setDeckToast(`Loaded "${char.name}" into Workbench!`);
    setTimeout(() => setDeckToast(null), 2400);
  };

  const handleDuplicateInDeck = (char: FantasyCharacter) => {
    const clone: FantasyCharacter = {
      ...char,
      id: `char_${Date.now()}_clone`,
      name: `${char.name} II`,
      createdAt: Date.now(),
    };
    setDeck((prev) => [clone, ...prev]);
    soundFX.playCardSave();
    setDeckToast(`Cloned "${clone.name}" in My Deck!`);
    setTimeout(() => setDeckToast(null), 2400);
  };

  const handleClearDeck = () => {
    setDeck([]);
    setDeckToast('Deck cleared');
    setTimeout(() => setDeckToast(null), 2000);
  };

  const handleOpenDiceCheck = (statKey: keyof CharacterStats, mod: number) => {
    setDiceParams({
      die: 20,
      mod,
      statName: statKey.charAt(0).toUpperCase() + statKey.slice(1),
    });
    setIsDiceRollerOpen(true);
  };

  const handleRerollStats = () => {
    // Generate new stats including Health, Mana, and Strength while preserving other locks
    const updated = createRandomCharacter(
      character,
      { name: true, class: true, race: true, stats: false },
      character.class,
      character.race
    );
    setCharacter(updated);
  };

  const handleGenerateCartoonPortrait = () => {
    soundFX.playDiceRoll();
    setIsGeneratingPortrait(true);
    setTimeout(() => {
      const updated = generateCartoonPortrait(character);
      setCharacter(updated);
      setIsGeneratingPortrait(false);
      soundFX.playCharacterSummon();
    }, 320);
  };

  const handleRegenerateCartoonPortrait = () => {
    soundFX.playDiceRoll();
    setIsGeneratingPortrait(true);
    setTimeout(() => {
      const updated = regeneratePortrait(character, 'cartoon');
      setCharacter(updated);
      setIsGeneratingPortrait(false);
      soundFX.playCharacterSummon();
    }, 320);
  };

  const handleTogglePortraitStyle = (style: 'painterly' | 'cartoon') => {
    soundFX.playClick();
    if (style === 'cartoon') {
      handleGenerateCartoonPortrait();
    } else {
      setCharacter((prev) => ({
        ...prev,
        portraitStyle: 'painterly',
      }));
    }
  };

  const handleGenerateBackstory = async () => {
    soundFX.playDiceRoll();
    setIsGeneratingBackstory(true);
    try {
      const newBackstory = await generateCharacterBackstory(character);
      setCharacter((prev) => ({
        ...prev,
        backstory: newBackstory,
      }));
      soundFX.playCharacterSummon();
    } finally {
      setIsGeneratingBackstory(false);
    }
  };

  const isInDeck = deck.some((c) => c.id === character.id);

  return (
    <div className="min-h-screen text-[#f5ebd7] flex flex-col selection:bg-[#d4af37] selection:text-stone-950 bg-workbench">
      {/* Top Bar with brand and 'My Deck' status */}
      <TopNav
        onGenerate={() => handleGenerate()}
        onOpenDeck={() => setIsDeckOpen(true)}
        onOpenDiceRoller={() => {
          setDiceParams({ die: 20, mod: 0 });
          setIsDiceRollerOpen(true);
        }}
        onOpenCodex={() => setIsCodexOpen(true)}
        deckCount={deck.length}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Toast Notification Banner */}
      {deckToast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#140e0a] border-2 border-[#d4af37] text-[#f7d58b] text-xs font-bold rounded-xl shadow-2xl backdrop-blur-md">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{deckToast}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Alchemist Workbench Reagent Rack & Catalysts */}
        <section aria-label="Alchemist Workbench Reagent Rack">
          <AlchemistWorkbenchShelf
            onTransmuteWithEssence={(targetClass) => handleGenerate(targetClass)}
            isRolling={isRolling}
          />
        </section>

        {/* Hero Generator Controls & Filter Bar */}
        <section aria-label="Character Generation Controls">
          <LockBar
            locks={locks}
            onToggleLock={handleToggleLock}
            selectedClassFilter={selectedClassFilter}
            onSelectClassFilter={setSelectedClassFilter}
            onGenerate={() => handleGenerate()}
            onResetLocks={handleResetLocks}
            isRolling={isRolling}
            isCartoonPortrait={character.portraitStyle === 'cartoon'}
            onToggleCartoonPortrait={() =>
              handleTogglePortraitStyle(character.portraitStyle === 'cartoon' ? 'painterly' : 'cartoon')
            }
          />
        </section>

        {/* The Dominant Centerpiece: The Bordered Player Card Layout */}
        <section
          aria-label="Bordered Player Card Sheet"
          className={`transition-all duration-300 ${
            isRolling ? 'opacity-70 scale-[0.99] filter blur-[0.5px]' : 'opacity-100 scale-100'
          }`}
        >
          <CharacterCard
            character={character}
            onSaveToDeck={handleSaveToDeck}
            isInDeck={isInDeck}
            onOpenDeckView={() => setIsDeckOpen(true)}
            deckCount={deck.length}
            onOpenDiceCheck={handleOpenDiceCheck}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            onRerollStats={handleRerollStats}
            onGenerateCartoonPortrait={handleGenerateCartoonPortrait}
            onRegenerateCartoonPortrait={handleRegenerateCartoonPortrait}
            onTogglePortraitStyle={handleTogglePortraitStyle}
            isGeneratingPortrait={isGeneratingPortrait}
            onGenerateBackstory={handleGenerateBackstory}
            isGeneratingBackstory={isGeneratingBackstory}
          />
        </section>

        {/* 'My Deck' Quick Tray Strip (Shows saved cards in user's deck) */}
        {deck.length > 0 && (
          <section
            aria-label="My Deck Tray Strip"
            className="bg-[#140f0c]/90 border-2 border-[#b38947]/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#785a32] flex items-center justify-center text-stone-950 font-bold shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f7d58b] font-fantasy flex items-center gap-2">
                  <span>My Deck</span>
                  <span className="text-xs font-mono text-amber-200/70">
                    ({deck.length} {deck.length === 1 ? 'Hero Saved' : 'Heroes Saved'})
                  </span>
                </h3>
                <p className="text-xs text-amber-200/60">
                  Quick swap cards into the workbench or manage your battle roster
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {deck.map((card) => {
                const isSelected = card.id === character.id;
                const cardHealth = card.health || card.hp || 100;
                const cardStrength = card.strength || card.stats?.strength || 14;

                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      soundFX.playCardDraw();
                      handleSelectFromDeck(card);
                    }}
                    title={`Load ${card.name} into workbench`}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37]/25 text-[#f7d58b] border-[#d4af37] shadow-md ring-1 ring-[#d4af37]/40'
                        : 'bg-[#0e0a07]/80 text-amber-200/80 border-[#785a32]/50 hover:border-[#d4af37]/60'
                    }`}
                  >
                    <img
                      src={getCharacterPortraitUrl(card)}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-[#8a6839]/60 shrink-0"
                    />
                    <span className="truncate max-w-[90px] font-bold font-fantasy-name">{card.name}</span>
                    <span className="text-[10px] text-rose-300 font-mono">❤️{cardHealth}</span>
                    <span className="text-[10px] text-amber-300 font-mono">⚔️{cardStrength}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  soundFX.playCardDraw();
                  setIsDeckOpen(true);
                }}
                className="text-xs text-stone-950 font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#f7d58b] to-[#d4af37] hover:brightness-110 whitespace-nowrap cursor-pointer transition-all shadow"
              >
                View Full Deck
              </button>
            </div>
          </section>
        )}

        {/* Quick Discovery Cards / Inspiration Strip */}
        <section aria-label="Quick Archetype Discovery" className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]/90 flex items-center gap-1.5 font-fantasy">
              <span>🜁 Transmutation Quick Formulas</span>
            </h3>
            <button
              onClick={() => setIsCodexOpen(true)}
              className="text-xs text-amber-200/70 hover:text-[#f7d58b] transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#b48a4b]" />
              <span>Explore Alchemical Codex</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                title: 'High Elf Sorcerer',
                cls: 'Mage' as CharacterClass,
                race: 'High Elf' as CharacterRace,
                desc: 'Master of arcane geometry & starfire',
              },
              {
                title: 'Dwarf Paladin',
                cls: 'Paladin' as CharacterClass,
                race: 'Mountain Dwarf' as CharacterRace,
                desc: 'Sacred bulwark of runic stone',
              },
              {
                title: 'Tiefling Warlock',
                cls: 'Warlock' as CharacterClass,
                race: 'Tiefling' as CharacterRace,
                desc: 'Hellfire pactbound occultist',
              },
              {
                title: 'Wood Elf Ranger',
                cls: 'Ranger' as CharacterClass,
                race: 'Wood Elf' as CharacterRace,
                desc: 'Silent sovereign of primeval mists',
              },
            ].map((preset) => (
              <button
                key={preset.title}
                onClick={() => handleGenerate(preset.cls, preset.race)}
                className="text-left p-3 rounded-xl bg-[#140e0a]/80 hover:bg-[#1e150f] border border-[#785a32]/40 hover:border-[#d4af37]/70 transition-all group cursor-pointer shadow"
              >
                <div className="text-xs font-bold text-[#f7d58b] group-hover:text-amber-200 font-fantasy">
                  {preset.title}
                </div>
                <div className="text-[11px] text-amber-200/50 mt-1 line-clamp-1">{preset.desc}</div>
                <div className="text-[10px] text-[#d4af37] font-semibold mt-2 flex items-center gap-1">
                  <span>Transmute Formula</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Atmospheric Footer */}
      <footer className="mt-12 py-6 border-t border-[#8a6839]/40 bg-[#0c0906]/95 backdrop-blur-md text-xs text-amber-200/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fantasy text-sm text-[#d4af37]">⚗ Alchemy of Heroes</span>
            <span>·</span>
            <span>Bordered Player Card & Alchemical Transmutation Engine</span>
          </div>

          <div className="flex items-center gap-4 text-amber-200/60">
            <button
              onClick={() => {
                soundFX.playCardDraw();
                setIsDeckOpen(true);
              }}
              className="hover:text-[#f7d58b] transition-colors flex items-center gap-1 cursor-pointer font-bold text-[#f7d58b]"
            >
              <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>My Deck ({deck.length})</span>
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setDiceParams({ die: 20, mod: 0 });
                setIsDiceRollerOpen(true);
              }}
              className="hover:text-[#f7d58b] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5 text-[#b48a4b]" />
              <span>Dice Divination</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsCodexOpen(true)}
              className="hover:text-[#f7d58b] transition-colors cursor-pointer"
            >
              Alchemical Codex
            </button>
          </div>
        </div>
      </footer>

      {/* 'My Deck' List View Modal / Drawer */}
      <MyDeckView
        isOpen={isDeckOpen}
        onClose={() => setIsDeckOpen(false)}
        deck={deck}
        activeCharacter={character}
        onSelectCharacter={handleSelectFromDeck}
        onRemoveFromDeck={handleRemoveFromDeck}
        onSaveActiveToDeck={handleSaveToDeck}
        onDuplicateInDeck={handleDuplicateInDeck}
        onClearDeck={handleClearDeck}
      />

      {/* Other Modals */}
      {isDiceRollerOpen && (
        <DiceRollerModal
          initialDie={diceParams.die}
          initialMod={diceParams.mod}
          initialStatName={diceParams.statName}
          onClose={() => setIsDiceRollerOpen(false)}
        />
      )}

      {isCustomizerOpen && (
        <CharacterCustomizerModal
          character={character}
          onSave={(updated) => setCharacter(updated)}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}

      {isCodexOpen && (
        <CodexModal
          onSelectClassToRoll={(c) => handleGenerate(c)}
          onSelectRaceToRoll={(r) => handleGenerate(undefined, r)}
          onClose={() => setIsCodexOpen(false)}
        />
      )}
    </div>
  );
}
