/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Dices, RotateCcw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface DiceRollerModalProps {
  initialDie?: number; // e.g. 20
  initialMod?: number; // e.g. +3
  initialStatName?: string; // e.g. 'Strength'
  onClose: () => void;
}

interface RollLog {
  id: string;
  dieType: number;
  roll: number;
  modifier: number;
  total: number;
  statName?: string;
  isCrit: boolean;
  isFumble: boolean;
  time: string;
}

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({
  initialDie = 20,
  initialMod = 0,
  initialStatName,
  onClose,
}) => {
  const [selectedDie, setSelectedDie] = useState<number>(initialDie);
  const [modifier, setModifier] = useState<number>(initialMod);
  const [statName, setStatName] = useState<string | undefined>(initialStatName);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollLog[]>([]);

  const DICE_TYPES = [20, 12, 10, 8, 6, 4, 100];

  const rollDice = (die = selectedDie, mod = modifier, stat = statName) => {
    soundFX.playDiceRoll();
    setIsRolling(true);

    let animationFrames = 0;
    const interval = setInterval(() => {
      setCurrentResult(Math.floor(Math.random() * die) + 1);
      animationFrames++;
      if (animationFrames > 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * die) + 1;
        setCurrentResult(finalRoll);
        setIsRolling(false);

        const isCrit = die === 20 && finalRoll === 20;
        const isFumble = die === 20 && finalRoll === 1;

        if (isCrit) {
          soundFX.playCharacterSummon();
        }

        const newLog: RollLog = {
          id: Math.random().toString(),
          dieType: die,
          roll: finalRoll,
          modifier: mod,
          total: finalRoll + mod,
          statName: stat,
          isCrit,
          isFumble,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        setHistory((prev) => [newLog, ...prev.slice(0, 7)]);
      }
    }, 45);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#140f0c] border border-[#8a6839]/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8a6839]/40 bg-[#0e0a07]/85">
          <div className="flex items-center gap-2">
            <Dices className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-base font-bold text-gold-leaf font-fantasy-title">
              Alchemical Dice Divination
            </h2>
            {statName && (
              <span className="text-xs text-amber-300 font-medium ml-2">
                · {statName} Check
              </span>
            )}
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

        {/* Dice Selection Bar */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {DICE_TYPES.map((die) => (
              <button
                key={die}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedDie(die);
                  setStatName(undefined);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedDie === die
                    ? 'bg-gradient-to-r from-[#e5c158] to-[#b48a4b] text-stone-950 border-[#d4af37] shadow-md'
                    : 'bg-[#0e0a07]/80 text-amber-200/80 border-[#785a32]/40 hover:border-[#d4af37]/50'
                }`}
              >
                d{die}
              </button>
            ))}
          </div>

          {/* Big Result Stage */}
          <div className="flex flex-col items-center justify-center py-6 bg-[#0e0a07]/80 border border-[#785a32]/50 rounded-2xl relative shadow-inner">
            <div className="text-xs uppercase tracking-widest text-[#d4af37]/70 font-semibold mb-2 font-fantasy">
              d{selectedDie} {modifier !== 0 ? `(${modifier >= 0 ? `+${modifier}` : modifier})` : ''}
            </div>

            <div
              className={`text-6xl font-extrabold font-mono-numbers transition-all ${
                isRolling
                  ? 'text-amber-200/40 scale-95 blur-[1px]'
                  : currentResult !== null
                  ? selectedDie === 20 && currentResult === 20
                    ? 'text-[#f7d58b] scale-110 drop-shadow-[0_0_20px_rgba(247,213,139,0.6)]'
                    : selectedDie === 20 && currentResult === 1
                    ? 'text-rose-500'
                    : 'text-[#f5ebd7]'
                  : 'text-amber-200/20'
              }`}
            >
              {currentResult !== null ? currentResult + modifier : '--'}
            </div>

            {currentResult !== null && (
              <div className="text-xs text-amber-200/70 mt-2 font-mono-numbers">
                Rolled <span className="text-[#f5ebd7] font-semibold">{currentResult}</span>
                {modifier !== 0 && (
                  <span>
                    {' '}
                    {modifier >= 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`} ={' '}
                    <span className="text-[#f7d58b] font-semibold">{currentResult + modifier}</span>
                  </span>
                )}
                {selectedDie === 20 && currentResult === 20 && (
                  <span className="text-[#f7d58b] font-bold block mt-1 tracking-wide font-fantasy">
                    NATURAL 20 — CELESTIAL TRANSMUTATION!
                  </span>
                )}
                {selectedDie === 20 && currentResult === 1 && (
                  <span className="text-rose-400 font-bold block mt-1 tracking-wide font-fantasy">
                    NATURAL 1 — ALCHEMICAL CALAMITY!
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => rollDice()}
              disabled={isRolling}
              className="mt-6 px-6 py-2.5 text-sm font-bold text-stone-950 bg-gradient-to-r from-[#e5c158] via-[#d4af37] to-[#b48a4b] hover:from-[#f3cf65] hover:to-[#c59b5c] active:scale-95 transition-all rounded-lg shadow-xl cursor-pointer disabled:opacity-50"
            >
              {isRolling ? 'Divining Roll...' : `Roll d${selectedDie}`}
            </button>
          </div>

          {/* Modifier adjustment */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
            <span>Modifier:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModifier((m) => m - 1)}
                className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold"
              >
                -
              </button>
              <span className="font-mono-numbers text-sm font-bold text-white w-8 text-center">
                {modifier >= 0 ? `+${modifier}` : modifier}
              </span>
              <button
                onClick={() => setModifier((m) => m + 1)}
                className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold"
              >
                +
              </button>
              {modifier !== 0 && (
                <button
                  onClick={() => setModifier(0)}
                  title="Reset modifier"
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors ml-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Roll History */}
          {history.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Recent Rolls
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-950/50 border border-slate-800/60 font-mono-numbers"
                  >
                    <span className="text-slate-400">
                      d{item.dieType}
                      {item.statName ? ` (${item.statName})` : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">{item.time}</span>
                      <span
                        className={`font-bold ${
                          item.isCrit
                            ? 'text-amber-400'
                            : item.isFumble
                            ? 'text-rose-500'
                            : 'text-white'
                        }`}
                      >
                        {item.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
