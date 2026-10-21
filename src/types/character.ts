/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharacterClass =
  | 'Warrior'
  | 'Mage'
  | 'Rogue'
  | 'Ranger'
  | 'Paladin'
  | 'Cleric'
  | 'Bard'
  | 'Warlock'
  | 'Druid'
  | 'Monk';

export type CharacterRace =
  | 'High Elf'
  | 'Wood Elf'
  | 'Mountain Dwarf'
  | 'Human'
  | 'Tiefling'
  | 'Dragonborn'
  | 'Half-Orc'
  | 'Halfling'
  | 'Gnome'
  | 'Celestial Aasimar';

export type Alignment =
  | 'Lawful Good'
  | 'Neutral Good'
  | 'Chaotic Good'
  | 'Lawful Neutral'
  | 'True Neutral'
  | 'Chaotic Neutral'
  | 'Lawful Evil'
  | 'Neutral Evil'
  | 'Chaotic Evil';

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterAbility {
  name: string;
  type: string; // e.g. 'Active Spell', 'Martial Maneuver', 'Passive Aura'
  description: string;
  costOrDamage: string;
}

export interface CharacterGear {
  weapon: string;
  armor: string;
  wondrousItem: string;
}

export interface FantasyCharacter {
  id: string;
  name: string;
  title: string;
  class: CharacterClass;
  subclass: string;
  race: CharacterRace;
  alignment: Alignment;
  level: number;
  hp: number;
  health: number; // Randomly generated Health stat
  maxHealth: number;
  mana: number;   // Randomly generated Mana stat
  maxMana: number;
  strength: number; // Randomly generated Strength stat
  ac: number;
  speed: number;
  initiative: number;
  stats: CharacterStats;
  signatureAbility: CharacterAbility;
  gear: CharacterGear;
  traits: string[];
  backstory: string;
  portraitUrl: string;
  cartoonPortraitUrl?: string;
  portraitStyle: 'painterly' | 'cartoon' | 'pixel' | 'chibi';
  portraitSeed: number;
  themeColor: string;
  accentColor: string;
  cardRarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  createdAt: number;
}

export interface LockSettings {
  name: boolean;
  class: boolean;
  race: boolean;
  stats: boolean;
}

export interface ClassDefinition {
  name: CharacterClass;
  role: string;
  hitDie: number; // e.g. 10 for d10
  primaryStats: (keyof CharacterStats)[];
  subclasses: string[];
  abilities: CharacterAbility[];
  weapons: string[];
  armors: string[];
  wondrousItems: string[];
  themeColor: string;
  accentColor: string;
  portraitUrl: string;
  iconName: string;
}

export interface RaceDefinition {
  name: CharacterRace;
  statBonus: Partial<Record<keyof CharacterStats, number>>;
  speed: number;
  trait: string;
  description: string;
}
