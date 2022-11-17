import { oneLine } from "common-tags";
import { EmbedBuilder } from "discord.js";
import { Base } from "./Base";
import { Fighter } from "./Fighter";
import { bold, BROWN, formatPercent, inlineCode, random } from "./utils";


/** 
 * Pet is a companion for Player which can be used in a battle. Pet will attack
 * during battle based on it's own attribute. To add your own pet, extend Pet
 * class and change the attributes to your liking.
 *
 * ```typescript
 *
 * export class Dragon extends Pet {
 *   name = "dragon";
 *   id = "dragon";
 *   attack = 20;
 *   interceptRate = 0.4;
 * }
 * ```
 * */
export abstract class Pet extends Base {
  /** Pet's owner name */
  ownerName: string = "";
  /** Image to represent this Pet */
  imageUrl?: string;
  /** Frequency to intercept and attack in battle in the form of percentage */
  interceptRate = 0.05;
  /** Damage dealt when attack */
  attack = 5;
  /** Description of the pet */
  description: string = "";

  /** Returns true if intercept */
  isIntercept() {
    return random.bool(this.interceptRate);
  }

  /** Sets the pet ownership */
  setOwner(player: Fighter) {
    player.pet = this;
    this.ownerName = player.name;
  }

  /** MessageEmbed that represents Pet */
  show() {
    const interceptRate = formatPercent(this.interceptRate);
    const embed = new EmbedBuilder()
      .setTitle("Pet")
      .setColor(BROWN)
      .setFields([
        { name: "Name", value: this.name, inline: true },
        { name: "Intercept Rate", value: inlineCode(interceptRate), inline: true },
        { name: "Attack", value: inlineCode(this.attack), inline: true },
      ]);

    if (this.description)
      embed.setDescription(this.description);

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }

  /** Action to take by Pet when in Battle */
  intercept(owner: Fighter, opponent: Fighter) {

    const armorProtection = opponent.armor * this.attack;
    const damageDealt = this.attack - armorProtection;

    opponent.hp -= damageDealt;

    const embed = new EmbedBuilder()
      .setTitle("Pet Interception")
      .setColor(BROWN)
      .setDescription(
        oneLine`${this.ownerName}'s ${this.name} attacks ${opponent.name} for
        ${bold(Math.round(damageDealt))} damage!`
      );

    if (this.imageUrl) 
      embed.setThumbnail(this.imageUrl);

    return embed;
  }
}

/** Pet example */
export class Dragon extends Pet {
  name = "dragon";
  id = "dragon";
  attack = 20;
  interceptRate = 0.4;
}
