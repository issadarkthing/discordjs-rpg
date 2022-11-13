import { oneLine } from "common-tags";
import { EmbedBuilder } from "discord.js";
import { Base } from "./Base";
import { Fighter } from "./Fighter";
import { formatPercent, GREEN, inlineCode, random } from "./utils";


/** 
 * Skill is used in the battle which the player will experience boost or any
 * kind of advantage during battle. 
 *
 * ```typescript
 * // example Skill which does double damage when intercept.
 * export class Rage extends Skill {
 *   name = "Rage";
 *   id = "rage";
 *   description = "Does double damage";
 *
 *   use(p1: Fighter, p2: Fighter) {
 *     p1.attack *= 2;
 *
 *     const embed = new MessageEmbed()
 *       .setTitle("Skill interception")
 *       .setColor(GREEN)
 *       .setDescription(
 *         oneLine`${p1.name} uses **${this.name} Skill** and increases their
 *         strength to ${inlineCode(p1.attack)}!`
 *       )
 *
 *     if (this.imageUrl)
 *       embed.setThumbnail(this.imageUrl);
 *
 *     return embed;
 *   }
 *  
 *   // this has to be overriden to prevent from skill's side effect leak to the
 *   // next round
 *   close(p1: Fighter, p2: Fighter) {
 *     p1.attack /= 2;
 *   }
 * }
 * ```
 * */
export abstract class Skill extends Base {
  /** Skill description */
  abstract description: string; 
  /** Frequency of Skill being activated during battle in percentage */
  interceptRate = 0.2;
  /** Image to represent this skill */
  imageUrl?: string;

  /** 
   * Mutates fighter's attributes during battle
   * @returns {EmbedBuilder} The embed will be shown during battle.
   * */
  abstract use(player: Fighter, opponent: Fighter): EmbedBuilder;

  /** Clean up or remove any attribute changes before next round */
  abstract close(player: Fighter, opponent: Fighter): void;

  /** Returns true if skill is activated */
  intercept() {
    return random.bool(this.interceptRate);
  }

  /** Sets the skill to player */
  setOwner(player: Fighter) {
    player.skill = this;
  }

  /** MessageEmbed that represents Skill */
  show() {
    const interceptRate = formatPercent(this.interceptRate);
    const embed = new EmbedBuilder()
      .setTitle("Skill")
      .setColor(GREEN)
      .setFields([
        { name: "Name", value: this.name },
        { name: "Intercept Rate", value: inlineCode(interceptRate), inline:true },
        { name: "Description", value: this.description },
      ])

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }
}

/** Skill example */
export class Rage extends Skill {
  name = "Rage";
  id = "rage";
  description = "Does double damage";

  use(p1: Fighter, p2: Fighter) {
    p1.attack *= 2;

    const embed = new EmbedBuilder()
      .setTitle("Skill interception")
      .setColor(GREEN)
      .setDescription(
        oneLine`${p1.name} uses **${this.name} Skill** and increases their
        strength to ${inlineCode(p1.attack)}!`
      )

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }

  close(p1: Fighter, p2: Fighter) {
    p1.attack /= 2;
  }
}
