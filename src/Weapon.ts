import { EmbedBuilder } from "discord.js";
import { Base } from "./Base";
import { Player } from "./Player";
import { inlineCode, SILVER } from "./utils";


/** 
 * Abstract weapon class to be used to increase Fighter's attack attribute. To
 * add your own weapon, extend Weapon class and change the attributes to your
 * liking.
 *
 * ```typescript
 * class Sword extends Weapon {
 *    name = "sword";
 *    id = "sword";
 *    attack = 15;
 * }
 * ```
 * */
export abstract class Weapon extends Base {
  /** References Player who owns this weapon */
  owner?: Player;
  /** Weapon image */
  imageUrl?: string;

  /** Attack attribute to be added when player equip this weapon */
  attack = 10;

  /** MessageEmbed that represents Weapon */
  show() {

    const embed = new EmbedBuilder()
      .setTitle("Weapon")
      .setColor(SILVER)
      .setFields([
        { name: "Name", value: this.name, inline: true },
        { name: "Attack", value: inlineCode(this.attack), inline: true },
      ])

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }
}

/** Armor example */
export class Sword extends Weapon {
  name = "sword";
  id = "sword";
  armor = 15;
}

