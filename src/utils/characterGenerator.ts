/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FantasyCharacter,
  CharacterClass,
  CharacterRace,
  CharacterStats,
  LockSettings,
  Alignment,
} from '../types/character';
import {
  CLASSES,
  RACES,
  FIRST_NAMES,
  SURNAMES,
  TITLES,
  BACKGROUND_ORIGINS,
  ALIGNMENTS,
} from '../data/fantasyData';

// Helper: pick random element from array
export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Roll 4d6 and drop lowest
export function roll4d6DropLowest(): number {
  const rolls = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

// Convert stat score (e.g. 16) to modifier (+3)
export function getStatModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Generate base stats with a bias toward the class's primary stats
export function generateStatsForClass(
  charClass: CharacterClass,
  race: CharacterRace
): CharacterStats {
  const classDef = CLASSES[charClass];
  const raceDef = RACES[race];

  // Roll 6 scores
  const scores: number[] = [];
  for (let i = 0; i < 6; i++) {
    // Generate heroic rolls between 10 and 18 for compelling adventurer stats
    const roll = Math.max(10, roll4d6DropLowest());
    scores.push(roll);
  }
  scores.sort((a, b) => b - a); // descending order

  const statKeys: (keyof CharacterStats)[] = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
  ];

  const assignedStats: Partial<CharacterStats> = {};

  // Assign highest rolls to primary stats of the class
  let scoreIdx = 0;
  classDef.primaryStats.forEach((primaryKey) => {
    assignedStats[primaryKey] = scores[scoreIdx++];
  });

  // Assign remaining scores to other stats
  statKeys.forEach((key) => {
    if (assignedStats[key] === undefined) {
      assignedStats[key] = scores[scoreIdx++];
    }
  });

  // Apply racial bonuses
  const finalStats: CharacterStats = {
    strength: (assignedStats.strength || 10) + (raceDef.statBonus.strength || 0),
    dexterity: (assignedStats.dexterity || 10) + (raceDef.statBonus.dexterity || 0),
    constitution: (assignedStats.constitution || 10) + (raceDef.statBonus.constitution || 0),
    intelligence: (assignedStats.intelligence || 10) + (raceDef.statBonus.intelligence || 0),
    wisdom: (assignedStats.wisdom || 10) + (raceDef.statBonus.wisdom || 0),
    charisma: (assignedStats.charisma || 10) + (raceDef.statBonus.charisma || 0),
  };

  return finalStats;
}

export function generateCharacterName(race: CharacterRace): { name: string; title: string } {
  const raceNames = FIRST_NAMES[race] || FIRST_NAMES['Human'];
  const firstName = getRandomElement(raceNames);
  const surname = getRandomElement(SURNAMES);
  const title = getRandomElement(TITLES);

  // Randomize full name format
  const formats = [
    `${firstName} ${surname}`,
    `${firstName} ${surname}`,
    `${firstName}`,
  ];
  return {
    name: getRandomElement(formats),
    title,
  };
}

export function createRandomCharacter(
  existing?: FantasyCharacter,
  locks?: LockSettings,
  forcedClass?: CharacterClass,
  forcedRace?: CharacterRace
): FantasyCharacter {
  const classList = Object.keys(CLASSES) as CharacterClass[];
  const raceList = Object.keys(RACES) as CharacterRace[];

  const charClass: CharacterClass =
    locks?.class && existing
      ? existing.class
      : forcedClass || getRandomElement(classList);

  const race: CharacterRace =
    locks?.race && existing
      ? existing.race
      : forcedRace || getRandomElement(raceList);

  const nameData =
    locks?.name && existing
      ? { name: existing.name, title: existing.title }
      : generateCharacterName(race);

  const classDef = CLASSES[charClass];
  const raceDef = RACES[race];

  const stats: CharacterStats =
    locks?.stats && existing
      ? { ...existing.stats }
      : generateStatsForClass(charClass, race);

  const conMod = getStatModifier(stats.constitution);
  const dexMod = getStatModifier(stats.dexterity);

  const level = existing?.level || 3;
  // Calculate HP: Level 1 max hit die + (level - 1) * (avg hit die + conMod)
  const baseHp = classDef.hitDie + conMod;
  const levelUpHp = (level - 1) * (Math.floor(classDef.hitDie / 2) + 1 + conMod);
  const totalHp = Math.max(12, baseHp + levelUpHp);

  // Calculate AC
  let baseAc = 10 + dexMod;
  if (charClass === 'Warrior' || charClass === 'Paladin') {
    baseAc = 18; // Heavy plate / shield
  } else if (charClass === 'Rogue' || charClass === 'Ranger') {
    baseAc = 14 + Math.min(3, Math.max(0, dexMod));
  } else if (charClass === 'Monk') {
    baseAc = 10 + dexMod + getStatModifier(stats.wisdom);
  } else if (charClass === 'Mage') {
    baseAc = 12 + dexMod; // Mage armor
  }

  const subclass = getRandomElement(classDef.subclasses);
  const signatureAbility = getRandomElement(classDef.abilities);
  const weapon = getRandomElement(classDef.weapons);
  const armor = getRandomElement(classDef.armors);
  const wondrousItem = getRandomElement(classDef.wondrousItems);
  const alignment: Alignment = getRandomElement(ALIGNMENTS);
  const backstorySnippet = getRandomElement(BACKGROUND_ORIGINS);

  // New randomly generated player card stats: Health, Mana, Strength
  let baseHealth = 100;
  if (charClass === 'Warrior' || charClass === 'Paladin') baseHealth = 140;
  else if (charClass === 'Cleric' || charClass === 'Druid' || charClass === 'Monk' || charClass === 'Ranger') baseHealth = 110;
  else if (charClass === 'Rogue' || charClass === 'Bard') baseHealth = 95;
  else if (charClass === 'Mage' || charClass === 'Warlock') baseHealth = 80;

  const healthRandomBonus = Math.floor(Math.random() * 35) + 5;
  const calculatedHealth = locks?.stats && existing?.health
    ? existing.health
    : Math.max(50, baseHealth + conMod * 5 + healthRandomBonus);

  let baseMana = 55;
  if (charClass === 'Mage' || charClass === 'Warlock') baseMana = 175;
  else if (charClass === 'Cleric' || charClass === 'Druid' || charClass === 'Bard') baseMana = 140;
  else if (charClass === 'Paladin' || charClass === 'Ranger' || charClass === 'Monk') baseMana = 90;
  else if (charClass === 'Warrior' || charClass === 'Rogue') baseMana = 45;

  const intMod = getStatModifier(stats.intelligence);
  const wisMod = getStatModifier(stats.wisdom);
  const chaMod = getStatModifier(stats.charisma);
  const highestMental = Math.max(intMod, wisMod, chaMod);
  const manaRandomBonus = Math.floor(Math.random() * 30) + 5;
  const calculatedMana = locks?.stats && existing?.mana
    ? existing.mana
    : Math.max(30, baseMana + highestMental * 6 + manaRandomBonus);

  const strMod = getStatModifier(stats.strength);
  let baseStrength = 14;
  if (charClass === 'Warrior' || charClass === 'Paladin') baseStrength = 20;
  else if (charClass === 'Monk' || charClass === 'Ranger' || charClass === 'Rogue') baseStrength = 16;
  else if (charClass === 'Cleric' || charClass === 'Druid') baseStrength = 14;
  else if (charClass === 'Mage' || charClass === 'Warlock' || charClass === 'Bard') baseStrength = 10;

  const strRandomRoll = Math.floor(Math.random() * 8) + 1;
  const calculatedStrength = locks?.stats && existing?.strength
    ? existing.strength
    : Math.max(8, baseStrength + strMod + strRandomRoll);

  const cardRarities: ('Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic')[] = [
    'Rare', 'Rare', 'Epic', 'Epic', 'Legendary', 'Mythic'
  ];
  const cardRarity = existing?.cardRarity || getRandomElement(cardRarities);

  const id = `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    name: nameData.name,
    title: nameData.title,
    class: charClass,
    subclass,
    race,
    alignment,
    level,
    hp: calculatedHealth,
    health: calculatedHealth,
    maxHealth: calculatedHealth,
    mana: calculatedMana,
    maxMana: calculatedMana,
    strength: calculatedStrength,
    ac: baseAc,
    speed: raceDef.speed,
    initiative: dexMod,
    stats,
    signatureAbility,
    gear: {
      weapon,
      armor,
      wondrousItem,
    },
    traits: [raceDef.trait, `${classDef.name} Specialty: ${subclass}`],
    backstory: backstorySnippet,
    portraitUrl: classDef.portraitUrl,
    portraitStyle: existing?.portraitStyle || 'painterly',
    portraitSeed: existing?.portraitSeed !== undefined ? existing.portraitSeed : Math.floor(Math.random() * 1000),
    themeColor: classDef.themeColor,
    accentColor: classDef.accentColor,
    cardRarity,
    createdAt: Date.now(),
  };
}
