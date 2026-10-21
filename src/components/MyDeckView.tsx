/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FantasyCharacter, CharacterClass } from '../types/character';
import { getCharacterPortraitUrl } from '../utils/portraitService';
import { soundFX } from '../utils/audio';
import {
  X,
  Heart,
  Zap,
  Sword,
  Search,
  Trash2,
  ExternalLink,
  Plus,
  Sparkles,
  Copy,
  Layers,
  LayoutGrid,
  List,
  Filter,
  Download,
  Shield,
  Scroll,
} from 'lucide-react';

interface MyDeckViewProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FantasyCharacter[];
  activeCharacter: FantasyCharacter;
  onSelectCharacter: (character: FantasyCharacter) => void;
  onRemoveFromDeck: (id: string) => void;
  onSaveActiveToDeck: (character: FantasyCharacter) => void;
  onDuplicateInDeck?: (character: FantasyCharacter) => void;
  onClearDeck?: () => void;
}

export const MyDeckView: React.FC<MyDeckViewProps> = ({
  isOpen,
  onClose,
  deck,
  activeCharacter,
  onSelectCharacter,
  onRemoveFromDeck,
  onSaveActiveToDeck,
  onDuplicateInDeck,
  onClearDeck,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'health' | 'mana' | 'strength' | 'name'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  if (!isOpen) return null;

  const isCurrentInDeck = deck.some((c) => c.id === activeCharacter.id);

  // Deck statistics
  const totalCards = deck.length;
  const avgHealth = totalCards > 0 ? Math.round(deck.reduce((sum, c) => sum + (c.health || c.hp || 0), 0) / totalCards) : 0;
  const avgMana = totalCards > 0 ? Math.round(deck.reduce((sum, c) => sum + (c.mana || 0), 0) / totalCards) : 0;
  const avgStrength = totalCards > 0 ? Math.round(deck.reduce((sum, c) => sum + (c.strength || c.stats.strength || 0), 0) / totalCards) : 0;

  // Filtered & sorted deck list
  const filteredDeck = useMemo(() => {
    return deck
      .filter((card) => {
        const matchesSearch =
          card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.race.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClassFilter === 'ALL' || card.class === selectedClassFilter;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => {
        if (sortBy === 'health') return (b.health || b.hp || 0) - (a.health || a.hp || 0);
        if (sortBy === 'mana') return (b.mana || 0) - (a.mana || 0);
        if (sortBy === 'strength') return (b.strength || b.stats.strength || 0) - (a.strength || a.stats.strength || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [deck, searchTerm, selectedClassFilter, sortBy]);

  const handleExportDeckJson = () => {
    soundFX.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `alchemist_player_deck_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="My Deck"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-5xl bg-[#130f0c] border-2 border-[#b38947] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] player-card-rim relative">
        {/* Antique Corner Ornaments */}
        <div className="card-corner-nw" />
        <div className="card-corner-ne" />
        <div className="card-corner-sw" />
        <div className="card-corner-se" />

        {/* Modal Header & Deck Stats Bar */}
        <div className="px-6 py-4 border-b border-[#785a32]/60 bg-[#0c0906]/95 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#785a32] p-0.5 shadow-md flex items-center justify-center">
              <Layers className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gold-leaf font-fantasy-title tracking-wide">
                  My Deck
                </h2>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#251d16] text-[#f7d58b] border border-[#785a32]/60 rounded-full">
                  {deck.length} {deck.length === 1 ? 'Card' : 'Cards'}
                </span>
              </div>
              <p className="text-xs text-amber-200/60 font-serif">
                Your preserved folio of transmuted heroes and legendary player cards
              </p>
            </div>
          </div>

          {/* Quick Deck Stats Badges */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {totalCards > 0 && (
              <div className="flex items-center gap-2 bg-[#19130d] px-3 py-1.5 rounded-lg border border-[#785a32]/40 text-xs">
                <span className="text-amber-200/60 font-medium">Avg:</span>
                <span className="flex items-center gap-1 text-rose-300 font-mono font-bold">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-500/30" />
                  {avgHealth}
                </span>
                <span className="text-amber-200/30">|</span>
                <span className="flex items-center gap-1 text-sky-300 font-mono font-bold">
                  <Zap className="w-3 h-3 text-sky-400 fill-sky-500/30" />
                  {avgMana}
                </span>
                <span className="text-amber-200/30">|</span>
                <span className="flex items-center gap-1 text-amber-300 font-mono font-bold">
                  <Sword className="w-3 h-3 text-amber-400" />
                  {avgStrength}
                </span>
              </div>
            )}

            {!isCurrentInDeck && (
              <button
                onClick={() => {
                  soundFX.playCardSave();
                  onSaveActiveToDeck(activeCharacter);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-[#f7d58b] to-[#d4af37] hover:brightness-110 rounded-lg shadow cursor-pointer transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current Card</span>
              </button>
            )}

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              aria-label="Close My Deck view"
              className="p-1.5 text-amber-200/70 hover:text-white rounded-lg hover:bg-[#251d16] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search, Filter & View Controls */}
        <div className="px-6 py-3 border-b border-[#785a32]/40 bg-[#140f0c]/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-amber-200/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deck by hero name, title, class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#0e0a07] border border-[#785a32]/60 rounded-lg text-[#f7d58b] placeholder-amber-200/40 focus:outline-none focus:border-[#d4af37] text-xs"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Class Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-200/50" />
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="bg-[#0e0a07] border border-[#785a32]/60 rounded-lg px-2.5 py-1.5 text-[#f7d58b] text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
              >
                <option value="ALL">All Classes</option>
                <option value="Warrior">Warrior</option>
                <option value="Mage">Mage</option>
                <option value="Rogue">Rogue</option>
                <option value="Ranger">Ranger</option>
                <option value="Paladin">Paladin</option>
                <option value="Cleric">Cleric</option>
                <option value="Bard">Bard</option>
                <option value="Warlock">Warlock</option>
                <option value="Druid">Druid</option>
                <option value="Monk">Monk</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0e0a07] border border-[#785a32]/60 rounded-lg px-2.5 py-1.5 text-[#f7d58b] text-xs focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="date">Sort: Recent First</option>
              <option value="health">Sort: Highest Health</option>
              <option value="mana">Sort: Highest Mana</option>
              <option value="strength">Sort: Highest Strength</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center border border-[#785a32]/60 rounded-lg bg-[#0e0a07] p-0.5">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setViewMode('grid');
                }}
                title="Card Grid Binder View"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#d4af37]/20 text-[#f7d58b]' : 'text-amber-200/50 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setViewMode('table');
                }}
                title="Roster List View"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#d4af37]/20 text-[#f7d58b]' : 'text-amber-200/50 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {totalCards > 0 && (
              <button
                onClick={handleExportDeckJson}
                title="Export Deck to JSON file"
                className="p-1.5 text-amber-200/70 hover:text-[#f7d58b] border border-[#785a32]/60 rounded-lg hover:bg-[#251d16] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body: Card Grid or Table */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0f0b08]/90">
          {filteredDeck.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#1e1711] border border-[#785a32]/60 flex items-center justify-center text-[#d4af37] mb-3">
                <Layers className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="text-base font-bold text-[#f7d58b] font-fantasy-title">
                {deck.length === 0 ? 'Your Deck is Currently Empty' : 'No Matching Cards Found'}
              </h3>
              <p className="text-xs text-amber-200/60 max-w-md mt-1 mb-5 font-serif">
                {deck.length === 0
                  ? 'Transmute your favorite characters on the alchemist workbench and click "Save to Deck" to build your custom battle deck!'
                  : 'Try clearing your search terms or filters to find saved characters.'}
              </p>
              {deck.length === 0 && (
                <button
                  onClick={() => {
                    soundFX.playCardSave();
                    onSaveActiveToDeck(activeCharacter);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-[#f7d58b] to-[#d4af37] rounded-lg shadow-md hover:brightness-110 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Currently Displayed Hero ({activeCharacter.name})</span>
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            /* Card Grid Binder View: Rendered as mini bordered player cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDeck.map((card) => {
                const isActive = card.id === activeCharacter.id;
                const portrait = getCharacterPortraitUrl(card);
                const cardHealth = card.health || card.hp || 100;
                const cardMana = card.mana || 50;
                const cardStrength = card.strength || card.stats.strength || 14;

                return (
                  <div
                    key={card.id}
                    className={`relative rounded-xl overflow-hidden transition-all duration-200 border-2 flex flex-col justify-between group shadow-xl ${
                      isActive
                        ? 'border-[#d4af37] bg-gradient-to-b from-[#251d16] to-[#120d09] ring-2 ring-[#d4af37]/40 scale-[1.01]'
                        : 'border-[#785a32]/70 bg-gradient-to-b from-[#1c1510] to-[#0e0a07] hover:border-[#d4af37]/80'
                    }`}
                  >
                    {/* Active Ribbon */}
                    {isActive && (
                      <div className="absolute top-0 right-0 bg-[#d4af37] text-stone-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-bl-lg shadow-md z-10 font-mono tracking-wider">
                        Active on Bench
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="p-3.5 border-b border-[#785a32]/40 bg-[#0d0906]/80 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#d4af37]/90 font-mono uppercase">
                          <span>{card.race}</span>
                          <span>•</span>
                          <span className="font-bold text-[#f7d58b]">{card.class}</span>
                        </div>
                        <h4 className="text-base font-bold text-gold-leaf font-fantasy-name truncate">
                          {card.name}
                        </h4>
                        <p className="text-[11px] text-amber-200/70 italic truncate font-serif">
                          &ldquo;{card.title}&rdquo;
                        </p>
                      </div>

                      <div className="text-[10px] font-bold px-2 py-0.5 rounded border border-[#785a32]/60 bg-[#1e1711] text-[#f7d58b] shrink-0 font-mono">
                        LVL {card.level}
                      </div>
                    </div>

                    {/* Card Artwork & Stat Badges Section */}
                    <div className="p-3.5 space-y-3">
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#8a6839]/60 bg-[#0d0907] shadow-inner group/art">
                        <img
                          src={portrait}
                          alt={card.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/art:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                        {/* Top-left Rarity badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded shadow bg-black/75 border border-[#8a6839]/60 text-amber-300">
                          {card.cardRarity || 'Rare'} Hero
                        </div>

                        {/* Style Badge */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-medium rounded bg-black/60 text-amber-200/80 border border-white/10">
                          {card.portraitStyle === 'cartoon' ? '🎮 Cartoon' : '🎨 Classic'}
                        </div>

                        {/* Alignment Footer Tag */}
                        <div className="absolute bottom-1.5 left-2 text-[10px] text-amber-200/80 font-mono">
                          {card.alignment}
                        </div>
                      </div>

                      {/* Prominent Card Stats Orbs: Health, Mana, Strength */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Health */}
                        <div className="stat-orb-health rounded-lg p-1.5 text-center flex flex-col items-center justify-center text-white">
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-100">
                            <Heart className="w-3 h-3 fill-white" />
                            <span>HP</span>
                          </div>
                          <div className="text-base font-extrabold font-mono-numbers leading-tight">
                            {cardHealth}
                          </div>
                          <div className="text-[9px] text-rose-200/80 font-medium">Health</div>
                        </div>

                        {/* Mana */}
                        <div className="stat-orb-mana rounded-lg p-1.5 text-center flex flex-col items-center justify-center text-white">
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-100">
                            <Zap className="w-3 h-3 fill-white" />
                            <span>MP</span>
                          </div>
                          <div className="text-base font-extrabold font-mono-numbers leading-tight">
                            {cardMana}
                          </div>
                          <div className="text-[9px] text-sky-200/80 font-medium">Mana</div>
                        </div>

                        {/* Strength */}
                        <div className="stat-orb-strength rounded-lg p-1.5 text-center flex flex-col items-center justify-center text-stone-950">
                          <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-900">
                            <Sword className="w-3 h-3" />
                            <span>STR</span>
                          </div>
                          <div className="text-base font-extrabold font-mono-numbers leading-tight">
                            {cardStrength}
                          </div>
                          <div className="text-[9px] text-stone-800 font-bold">Strength</div>
                        </div>
                      </div>

                      {/* 1-2 Sentence Backstory Lore Snippet */}
                      <div className="bg-[#120d09]/90 border border-[#785a32]/40 rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-[#d4af37] font-semibold mb-1">
                          <Scroll className="w-3 h-3" />
                          <span>Origin Story</span>
                        </div>
                        <p className="text-[11px] text-amber-100/80 italic font-serif leading-snug line-clamp-2">
                          &ldquo;{card.backstory}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-[#0d0906]/90 border-t border-[#785a32]/40 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          soundFX.playCardDraw();
                          onSelectCharacter(card);
                          onClose();
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#d4af37]/20 text-[#f7d58b] border border-[#d4af37]/60'
                            : 'bg-gradient-to-r from-[#f7d58b] to-[#d4af37] text-stone-950 hover:brightness-110'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isActive ? 'Current on Bench' : 'Load Card'}</span>
                      </button>

                      {onDuplicateInDeck && (
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            onDuplicateInDeck(card);
                          }}
                          title="Duplicate Card"
                          className="p-1.5 text-amber-200/70 hover:text-[#f7d58b] bg-[#1a140f] border border-[#785a32]/50 rounded-lg hover:bg-[#251d16] transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          soundFX.playClick();
                          onRemoveFromDeck(card.id);
                        }}
                        title="Remove Card from My Deck"
                        className="p-1.5 text-rose-400/80 hover:text-rose-300 bg-[#1a140f] border border-rose-900/40 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table Roster View */
            <div className="bg-[#120d09] border border-[#785a32]/60 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-amber-100/90 border-collapse">
                  <thead>
                    <tr className="border-b border-[#785a32]/60 bg-[#0c0906] text-[#d4af37] font-fantasy uppercase text-[11px]">
                      <th className="py-3 px-4">Hero Card</th>
                      <th className="py-3 px-3">Class & Lineage</th>
                      <th className="py-3 px-3 text-center">Health</th>
                      <th className="py-3 px-3 text-center">Mana</th>
                      <th className="py-3 px-3 text-center">Strength</th>
                      <th className="py-3 px-3">Signature Ability</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#785a32]/30">
                    {filteredDeck.map((card) => {
                      const isActive = card.id === activeCharacter.id;
                      const portrait = getCharacterPortraitUrl(card);
                      const cardHealth = card.health || card.hp || 100;
                      const cardMana = card.mana || 50;
                      const cardStrength = card.strength || card.stats.strength || 14;

                      return (
                        <tr
                          key={card.id}
                          className={`hover:bg-[#1a140f] transition-colors ${
                            isActive ? 'bg-[#d4af37]/10' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={portrait}
                                alt={card.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover border border-[#8a6839]/60 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-[#f7d58b] font-fantasy-name text-sm">
                                  {card.name}
                                </div>
                                <div className="text-[11px] text-amber-200/60 italic font-serif">
                                  &ldquo;{card.title}&rdquo;
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-[#f5ebd7]">{card.class}</div>
                            <div className="text-[10px] text-amber-200/50">{card.race} • {card.subclass}</div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 font-mono-numbers font-bold text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
                              <Heart className="w-3 h-3 text-rose-400 fill-rose-500/30" />
                              {cardHealth}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 font-mono-numbers font-bold text-sky-300 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                              <Zap className="w-3 h-3 text-sky-400 fill-sky-500/30" />
                              {cardMana}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 font-mono-numbers font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                              <Sword className="w-3 h-3 text-amber-400" />
                              {cardStrength}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-xs">
                            <div className="font-medium text-[#f7d58b] truncate">
                              {card.signatureAbility.name}
                            </div>
                            <div className="text-[10px] text-amber-200/60 truncate">
                              {card.signatureAbility.type}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  soundFX.playCardDraw();
                                  onSelectCharacter(card);
                                  onClose();
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-stone-950 bg-gradient-to-r from-[#f7d58b] to-[#d4af37] hover:brightness-110 rounded cursor-pointer transition-all"
                              >
                                {isActive ? 'Bench' : 'Load'}
                              </button>
                              <button
                                onClick={() => {
                                  soundFX.playClick();
                                  onRemoveFromDeck(card.id);
                                }}
                                title="Remove from Deck"
                                className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#785a32]/60 bg-[#0c0906] flex items-center justify-between text-xs text-amber-200/60">
          <div className="flex items-center gap-3">
            <span>
              Showing {filteredDeck.length} of {deck.length} saved player cards
            </span>
            {deck.length > 0 && onClearDeck && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your entire deck?')) {
                    onClearDeck();
                  }
                }}
                className="text-rose-400/70 hover:text-rose-300 transition-colors underline cursor-pointer"
              >
                Clear Entire Deck
              </button>
            )}
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#1c1510] hover:bg-[#251d16] border border-[#785a32]/60 rounded-lg text-amber-200 hover:text-white transition-colors cursor-pointer font-medium"
          >
            Return to Workbench
          </button>
        </div>
      </div>
    </div>
  );
};
