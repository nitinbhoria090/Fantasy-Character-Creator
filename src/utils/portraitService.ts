/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FantasyCharacter } from '../types/character';
import { CARTOON_CLASS_PORTRAITS, CLASS_PORTRAITS } from '../data/fantasyData';

/**
 * Returns the effective image URL for the character based on active portrait style and seed.
 */
export function getCharacterPortraitUrl(character: FantasyCharacter): string {
  // If custom AI-generated data URL or URL is stored on the character, prefer it
  if (character.portraitStyle === 'cartoon' && character.cartoonPortraitUrl) {
    return character.cartoonPortraitUrl;
  }

  if (character.portraitStyle === 'cartoon') {
    const list = CARTOON_CLASS_PORTRAITS[character.class] || CARTOON_CLASS_PORTRAITS.Warrior;
    const index = Math.abs(character.portraitSeed) % list.length;
    return list[index];
  }

  // Default painterly concept art
  return CLASS_PORTRAITS[character.class] || CLASS_PORTRAITS.Warrior;
}

/**
 * Generates a cartoon/video game style portrait for the character.
 */
export function generateCartoonPortrait(character: FantasyCharacter): FantasyCharacter {
  const list = CARTOON_CLASS_PORTRAITS[character.class] || CARTOON_CLASS_PORTRAITS.Warrior;
  const newSeed = (character.portraitSeed || 0) + 1;
  const selectedPortrait = list[newSeed % list.length];

  return {
    ...character,
    portraitStyle: 'cartoon',
    portraitSeed: newSeed,
    cartoonPortraitUrl: selectedPortrait,
  };
}

/**
 * Regenerates the portrait (rolls a fresh variation, pose, or seed).
 */
export function regeneratePortrait(
  character: FantasyCharacter,
  targetStyle: 'cartoon' | 'painterly' = 'cartoon'
): FantasyCharacter {
  const newSeed = Math.floor(Math.random() * 10000);

  if (targetStyle === 'cartoon') {
    const list = CARTOON_CLASS_PORTRAITS[character.class] || CARTOON_CLASS_PORTRAITS.Warrior;
    const selectedPortrait = list[newSeed % list.length];
    return {
      ...character,
      portraitStyle: 'cartoon',
      portraitSeed: newSeed,
      cartoonPortraitUrl: selectedPortrait,
    };
  } else {
    return {
      ...character,
      portraitStyle: 'painterly',
      portraitSeed: newSeed,
      portraitUrl: CLASS_PORTRAITS[character.class] || CLASS_PORTRAITS.Warrior,
    };
  }
}
