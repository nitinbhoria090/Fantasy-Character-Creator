/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FantasyCharacter } from '../types/character';

// Procedural 1-2 sentence origin generators grouped by theme and class
const CLASS_ORIGIN_SENTENCE_ONE: Record<string, ((c: FantasyCharacter) => string)[]> = {
  Warrior: [
    (c) =>
      `Born amid the ironclad war-camps of the frontier, ${c.name} took up the ${c.gear.weapon} after their regiment held the burning gates against an overwhelming horde.`,
    (c) =>
      `Once an elite captain in the sovereign guard, ${c.name} renounced their sworn commission upon uncovering high treason within the royal citadel.`,
    (c) =>
      `Hardened by brutal gladiatorial arenas in the southern wastes, ${c.name} shattered their slave-collars with sheer martial willpower and forged their own destiny.`,
    (c) =>
      `Hailing from a proud martial clan, ${c.name} was chosen as the champion to bear their ancestral ${c.gear.weapon} into uncharted territories.`,
  ],
  Mage: [
    (c) =>
      `While deciphering forbidden astrological scrolls within the Great Library, ${c.name} accidentally attuned their mind to an ancient cosmic rift.`,
    (c) =>
      `Exiled from the High Arcanum for conducting daring transmutations that defied imperial decree, ${c.name} now pursues mystical truths beyond orthodox dogma.`,
    (c) =>
      `Marked from birth by pulsing celestial runes across their skin, ${c.name} learned to channel raw aether through their ${c.gear.wondrousItem}.`,
    (c) =>
      `Orphaned upon the steps of a secluded wizarding spire, ${c.name} quickly surpassed their archmage mentors in unlocking the secrets of the cosmos.`,
  ],
  Rogue: [
    (c) =>
      `Raised in the labyrinthine shadows of the grand bazaars, ${c.name} earned renown as an untraceable infiltrator who only preys upon corrupt merchant barons.`,
    (c) =>
      `After executing a daring midnight heist deep inside the Sunken Vaults, ${c.name} fled into the hinterlands with bounty hunters hot on their heels.`,
    (c) =>
      `Trained from childhood by the secretive Shadow Syndicate, ${c.name} severed ties with their masters after refusing an unjust assassination contract.`,
    (c) =>
      `A cunning survivor with quick fingers and quicker wits, ${c.name} relies on their trusty ${c.gear.weapon} to slip through unseen perils.`,
  ],
  Paladin: [
    (c) =>
      `Sworn to an unyielding oath before the weeping dawn statue, ${c.name} was anointed with sacred oils to banish encroaching demonic shadows.`,
    (c) =>
      `A former noble knight who witnessed miraculous divine intervention during a hopeless siege, ${c.name} dedicated their life to righteous retribution.`,
    (c) =>
      `Guided by the radiant warmth of their ${c.gear.wondrousItem}, ${c.name} wanders the forsaken borderlands to shelter the meek and uphold sacred justice.`,
    (c) =>
      `When their holy sanctuary was razed by heretical zealots, ${c.name} arose from the smoldering ash as a walking beacon of vengeance.`,
  ],
  Cleric: [
    (c) =>
      `Chosen as a divine vessel after a miraculous revelation in the high heavens, ${c.name} channels sacred power through their blessed ${c.gear.wondrousItem}.`,
    (c) =>
      `A devoted healer from an isolated clifftop monastery, ${c.name} ventured into the wider realm when celestial portents foretold a coming blight.`,
    (c) =>
      `Consecrated in the holy waters of the Dawnforge, ${c.name} wields both prayer and the ${c.gear.weapon} to heal allies and purify corrupted souls.`,
    (c) =>
      `Surviving a near-fatal shipwreck through divine providence, ${c.name} pledged their breath to serve as an emissary between mortal folk and the gods.`,
  ],
  Ranger: [
    (c) =>
      `Guardian of the primeval elderwoods, ${c.name} has tracked dangerous beast packs and protected sacred groves from ruthless poachers for decades.`,
    (c) =>
      `The sole survivor of an ambushed wilderness caravan, ${c.name} learned the language of the winds and mastered the deadly art of long-range archery.`,
    (c) =>
      `Patrolling the perilous mountain passes where civilized realms end, ${c.name} stalks unnatural monstrosities with relentless patience and deadly precision.`,
    (c) =>
      `Bound to the primal spirits of the wild, ${c.name} relies on their keen senses and trusty ${c.gear.weapon} to navigate the realm's deadliest terrains.`,
  ],
  Bard: [
    (c) =>
      `A prodigy of the Grand Conservatory, ${c.name} was banished after performing a satirical ballad that mocked the reigning tyrant during a coronation banquet.`,
    (c) =>
      `Wandering from royal ballrooms to rowdy tavern hearths, ${c.name} weaves potent enchantments and historic sagas into every pluck of their strings.`,
    (c) =>
      `Custodian of forgotten folklore and court intrigue, ${c.name} travels the provinces gathering epic tales and stirring the hearts of rebellion.`,
    (c) =>
      `Blessed with silver-tongued charm and melodic magic, ${c.name} can disarm hostile warlords with a verse as easily as with their ${c.gear.weapon}.`,
  ],
  Warlock: [
    (c) =>
      `Driven by a thirst for esoteric truth, ${c.name} forged an eldritch pact with an ancient patron slumbering beneath the abyssal sea.`,
    (c) =>
      `In exchange for surviving a deadly curse in their youth, ${c.name} accepted otherworldly powers etched directly into their ${c.gear.wondrousItem}.`,
    (c) =>
      `Bound by a shadowy covenant signed in starlight, ${c.name} walks the line between terrifying forbidden magic and personal salvation.`,
    (c) =>
      `Whispering secrets bestowed by an enigmatic entity from the astral void, ${c.name} seeks to unravel the mysteries of existence at any cost.`,
  ],
  Druid: [
    (c) =>
      `Initiated into the Circle of Elder Stones beneath a blood moon, ${c.name} commands the untamed fury of storm and beast to preserve natural balance.`,
    (c) =>
      `Reared by an ancient woodland spirit after being abandoned in the briars as an infant, ${c.name} speaks the tongue of flora and fauna.`,
    (c) =>
      `When corrupting blight withered their sacred ancestral grove, ${c.name} set out across the continents to cleanse tainted leylines.`,
    (c) =>
      `Channeling the primordial wrath of the elements through their ${c.gear.wondrousItem}, ${c.name} defends the wild from civil encroachment.`,
  ],
  Monk: [
    (c) =>
      `Trained in an austere monastery perched atop jagged wind-swept peaks, ${c.name} honed their body and spirit into an indivisible living weapon.`,
    (c) =>
      `Following decades of silent contemplation and rigorous martial trials, ${c.name} departed their hermitage on a pilgrimage of enlightenment.`,
    (c) =>
      `Having mastered the flowing currents of vital ki, ${c.name} deflects deadly blows effortlessly while striking with explosive, pinpoint grace.`,
    (c) =>
      `Once an impulsive street brawler, ${c.name} found serene discipline and deadly focus under the guidance of a blind martial master.`,
  ],
};

const CLASS_ORIGIN_SENTENCE_TWO: Record<string, ((c: FantasyCharacter) => string)[]> = {
  Warrior: [
    (c) =>
      `Now bearing the title of ${c.title}, they march onward to test their mettle against the realm's most monstrous horrors.`,
    (c) =>
      `Guided by an unshakeable warrior's code, they fight to ensure that no innocent ever suffers under tyrannical oppression.`,
    (c) =>
      `With every clash of steel, they seek an epic glory worthy of the warrior ballads of old.`,
    (c) =>
      `They will not rest until their homeland is restored and their fallen comrades are avenged.`,
  ],
  Mage: [
    (c) =>
      `Known by folk across the provinces as ${c.title}, they travel seeking relics capable of averting a looming cataclysm.`,
    (c) =>
      `Each incantation they cast brings them one step closer to deciphering the ultimate riddle of creation.`,
    (c) =>
      `They now wander the continent hunting down corrupted grimoires before they fall into nefarious hands.`,
    (c) =>
      `Driven by boundless curiosity, they venture into ancient ruins where others fear to tread.`,
  ],
  Rogue: [
    (c) =>
      `Operating under the moniker of ${c.title}, they now turn their lethal talents toward hunting down the syndicate that betrayed them.`,
    (c) =>
      `In a world of shifting allegiances, they trust only their keen instincts and their ${c.gear.weapon}.`,
    (c) =>
      `Though quiet in step, their audacious exploits have made them a legendary figure among the realm's underworld.`,
    (c) =>
      `They wander the shadows, always watching for the single score that will buy them permanent freedom.`,
  ],
  Paladin: [
    (c) =>
      `Embodying their moniker as ${c.title}, they ride fearless into darkness to ignite hope where all seems lost.`,
    (c) =>
      `Their blessed blade will never sleep so long as wickedness threatens the innocent.`,
    (c) =>
      `Though the burden of their holy vow weighs heavy, their resolve burns brighter than the summer sun.`,
    (c) =>
      `With sacred righteousness at their side, they stand as an unbreakable bulwark against despair.`,
  ],
  Cleric: [
    (c) =>
      `Revered by believers as ${c.title}, they travel the scarred land offering redemption to the penitent and holy wrath to the unrepentant.`,
    (c) =>
      `With divine faith as their lantern, they bring solace to the afflicted and judgment to the wicked.`,
    (c) =>
      `They journey ever onward, confident that their deity's hand guides every step of their path.`,
    (c) =>
      `No plague or curse can stand against the radiant benedictions they wield.`,
  ],
  Ranger: [
    (c) =>
      `Hailed across the frontier as ${c.title}, they remain the first line of defense against the lurking nightmares of the unknown wild.`,
    (c) =>
      `Their arrows never miss their mark, carrying the grim judgment of the ancient woodlands.`,
    (c) =>
      `They roam untrodden trails, safeguarding travelers who must brave the howling wilderness.`,
    (c) =>
      `Quiet and watchful, they find deeper companionship among the pines than in crowded city halls.`,
  ],
  Bard: [
    (c) =>
      `Celebrated as ${c.title}, they now chase rumors of a legendary forgotten chronicle said to hold the secrets of eternity.`,
    (c) =>
      `Wherever they travel, their stirring verses turn common villagers into bold heroes of destiny.`,
    (c) =>
      `With a sly grin and a quick wit, they seek to write their own name among the greatest legends ever sung.`,
    (c) =>
      `Their music holds the rare power to charm monarchs and rally broken armies to glorious victory.`,
  ],
  Warlock: [
    (c) =>
      `Bearing the dark renown of ${c.title}, they gather eldritch power to ensure they never fall prey to mortal frailty again.`,
    (c) =>
      `Though feared by common folk, their strange powers may prove to be the realm's only salvation against cosmic ruin.`,
    (c) =>
      `They wander the fringes of civilization, seeking the elusive answers their patron demands of them.`,
    (c) =>
      `Every bargain they strike is a calculated gamble against fate itself.`,
  ],
  Druid: [
    (c) =>
      `Known to forest folk as ${c.title}, they stand ready to unleash nature's untamed wrath against any who despoil the land.`,
    (c) =>
      `The roots and rivers whisper secrets to them, guiding their paws and boots across the continent.`,
    (c) =>
      `They strive to heal the weeping wounds of the earth before all green life turns to dust.`,
    (c) =>
      `Rooted in the primordial cycle of birth and renewal, their spirit cannot be bound by mortal chains.`,
  ],
  Monk: [
    (c) =>
      `Revered as ${c.title}, they walk the land seeking worthy trials to test the perfection of their inner spirit.`,
    (c) =>
      `Each trial they face is approached with serene clarity and unyielding spiritual resolve.`,
    (c) =>
      `Through meditative discipline and devastating strikes, they maintain balance between light and shadow.`,
    (c) =>
      `They ask for neither wealth nor praise, letting their selfless actions speak for the harmony of their path.`,
  ],
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Procedurally generates a unique, tailored, 1-to-2-sentence origin backstory
 * specifically constructed for the given character.
 */
export function generateProceduralBackstory(character: FantasyCharacter): string {
  const classKey = character.class in CLASS_ORIGIN_SENTENCE_ONE ? character.class : 'Warrior';
  const sentenceOneGenerators = CLASS_ORIGIN_SENTENCE_ONE[classKey] || CLASS_ORIGIN_SENTENCE_ONE.Warrior;
  const sentenceTwoGenerators = CLASS_ORIGIN_SENTENCE_TWO[classKey] || CLASS_ORIGIN_SENTENCE_TWO.Warrior;

  const s1 = getRandomElement(sentenceOneGenerators)(character);
  const s2 = getRandomElement(sentenceTwoGenerators)(character);

  return `${s1} ${s2}`;
}

/**
 * Primary backstory generation function.
 * Attempts Gemini API if configured with a valid key, with an immediate,
 * seamless fallback to the procedural origin generator.
 */
export async function generateCharacterBackstory(character: FantasyCharacter): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

  // If a valid key is provided (not placeholder), try calling Gemini Flash
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Write an atmospheric, unique origin story for this fantasy character in STRICTLY 1 to 2 sentences:
Name: ${character.name} (${character.title})
Race: ${character.race}
Class: ${character.class} (${character.subclass})
Alignment: ${character.alignment}
Signature Weapon: ${character.gear.weapon}
Wondrous Item: ${character.gear.wondrousItem}

Requirements:
- Exactly 1 to 2 sentences in length.
- Evocative, epic fantasy tone fitting an ancient alchemist's folio.
- Mention their motivation, inciting origin, and current resolve.
- Do not include quotes, markdown headers, or bullet points. Just the 1-2 sentences.`;

      // Timeout after 3.5 seconds to guarantee snappy UI response
      const apiPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 3500)
      );

      const response = await Promise.race([apiPromise, timeoutPromise]);
      const text = response.text?.trim();
      if (text && text.length > 20) {
        return text;
      }
    } catch {
      // Graceful fallback to procedural generator on network error, key issue, or timeout
    }
  }

  // Guaranteed, instantaneous, procedural origin story
  return generateProceduralBackstory(character);
}
