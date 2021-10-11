import { oneLine } from "common-tags";
import { MessageEmbed } from "discord.js";
import { Base } from "./Base";
import { Fighter } from "./Fighter";
import { Player } from "./Player";
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
  /** Pet's owner */
  owner?: Player;
  /** Image to represent this Pet */
  imageUrl?: string;
  /** Frequency to intercept and attack in battle in the form of percentage */
  interceptRate = 0.05;
  /** Damage dealt when attack */
  attack = 5;

  /** Returns true if intercept */
  isIntercept() {
    return random().bool(this.interceptRate);
  }

  /** Sets the pet ownership */
  setOwner(player: Player) {
    player.pet = this;
    this.owner = player;
  }

  /** MessageEmbed that represents Pet */
  show() {
    const interceptRate = formatPercent(this.interceptRate);
    const embed = new MessageEmbed()
      .setTitle("Pet")
      .setColor(BROWN)
      .addField("Name", this.name, true)
      .addField("Intercept Rate", inlineCode(interceptRate), true)
      .addField("Attack", inlineCode(this.attack), true)

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }

  /** Action to take by Pet when in Battle */
  intercept(opponent: Fighter) {

    if (!this.owner) throw new Error("pet cannot attack without owner");

    const armorProtection = opponent.armor * this.attack;
    const damageDealt = this.attack - armorProtection;

    opponent.hp -= damageDealt;

    const embed = new MessageEmbed()
      .setTitle("Pet Interception")
      .setColor(BROWN)
      .setDescription(
        oneLine`${this.owner.name}'s ${this.name} attacks ${opponent.name} for
        ${bold(damageDealt)} damage!`
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
