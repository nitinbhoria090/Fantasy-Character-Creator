/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FantasyCharacter } from '../types/character';
import { getCharacterPortraitUrl } from '../utils/portraitService';
import { X, Trash2, Eye, Shield, Heart, Copy, Check, UserPlus } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface PartyRosterProps {
  party: FantasyCharacter[];
  activeCharacterId: string;
  onSelectCharacter: (char: FantasyCharacter) => void;
  onRemoveCharacter: (id: string) => void;
  onClearParty: () => void;
  onClose: () => void;
}

export const PartyRoster: React.FC<PartyRosterProps> = ({
  party,
  activeCharacterId,
  onSelectCharacter,
  onRemoveCharacter,
  onClearParty,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleExportParty = () => {
    soundFX.playClick();
    const partyText = party
      .map(
        (c, idx) =>
          `[Hero ${idx + 1}] ${c.name} - ${c.title}\nLevel ${c.level} ${c.race} ${c.class} (${c.subclass}) | HP: ${c.hp} | AC: ${c.ac} | Ability: ${c.signatureAbility.name}\nWeapon: ${c.gear.weapon}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(`=== ADVENTURING PARTY ROSTER ===\n\n${partyText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#140f0c] border border-[#8a6839]/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8a6839]/40 bg-[#0e0a07]/85">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gold-leaf font-fantasy-title">
              Alchemical Party Folio
            </h2>
            <span className="text-xs text-amber-200/60 font-mono-numbers">
              {party.length} / 6 Champions Enrolled
            </span>
          </div>

          <div className="flex items-center gap-2">
            {party.length > 0 && (
              <>
                <button
                  onClick={handleExportParty}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-[#241a13] hover:bg-[#302219] border border-[#785a32]/60 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Export Folio'}</span>
                </button>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onClearParty();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </>
            )}
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
          {party.length === 0 ? (
            <div className="text-center py-16 text-amber-200/50">
              <UserPlus className="w-12 h-12 mx-auto text-[#d4af37]/60 mb-3" />
              <p className="text-base font-semibold text-[#f7d58b] font-fantasy-title">Your party folio is currently empty</p>
              <p className="text-xs text-amber-200/60 max-w-sm mx-auto mt-1 font-serif">
                Transmute new characters and click &ldquo;Add to Party&rdquo; to assemble an adventuring company of up to 6 champions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {party.map((char) => {
                const isActive = char.id === activeCharacterId;
                return (
                  <div
                    key={char.id}
                    className={`flex items-stretch gap-4 p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-[#d4af37]/15 border-[#d4af37]/60 shadow-lg shadow-amber-500/10'
                        : 'bg-[#0e0a07]/80 border-[#785a32]/40 hover:border-[#d4af37]/50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#8a6839]/60 shrink-0 bg-[#0c0907] relative shadow-md">
                      <img
                        src={getCharacterPortraitUrl(char)}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-[#f7d58b] font-fantasy-name truncate">
                            {char.name}
                          </h3>
                          {isActive && (
                            <span className="text-[10px] font-mono-numbers text-[#f7d58b] font-bold px-1.5 py-0.5 rounded bg-[#d4af37]/25 border border-[#d4af37]/50 shrink-0">
                              Active Folio
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-amber-200/60 truncate font-fantasy">
                          {char.race} · {char.class} ({char.subclass})
                        </p>
                      </div>

                      {/* Stat chips */}
                      <div className="flex items-center gap-3 text-xs text-amber-200/80 mt-2">
                        <span className="flex items-center gap-1 text-rose-400">
                          <Heart className="w-3 h-3" />
                          <span className="font-mono-numbers">{char.hp}</span>
                        </span>
                        <span className="flex items-center gap-1 text-sky-400">
                          <Shield className="w-3 h-3" />
                          <span className="font-mono-numbers">{char.ac}</span>
                        </span>
                        <span className="text-amber-200/50 text-[11px] truncate">
                          {char.signatureAbility.name}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#785a32]/30">
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            onSelectCharacter(char);
                            onClose();
                          }}
                          className="flex items-center gap-1 text-xs text-[#d4af37] hover:text-[#f7d58b] transition-colors font-medium cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Folio</span>
                        </button>
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            onRemoveCharacter(char.id);
                          }}
                          className="flex items-center gap-1 text-xs text-amber-200/40 hover:text-rose-400 transition-colors ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
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
