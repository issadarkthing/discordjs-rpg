import { MessageEmbed } from "discord.js";
import { Base } from "./Base";
import { Player } from "./Player";
import { GREEN } from "./utils";


export abstract class Skill extends Base {
  abstract description: string; 
  imageUrl?: string;
  owner?: Player;

  abstract use(
    attackRate: number, 
    armorProtection: number, 
    damageDealt: number,
  ): [number, number, number];

  show() {
    const embed = new MessageEmbed()
      .setTitle("Skill")
      .setColor(GREEN)
      .addField("Name", this.name)
      .addField("Description", this.description)

    return embed;
  }
}
