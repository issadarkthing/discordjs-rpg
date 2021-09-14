import { MessageEmbed } from "discord.js";
import { Player } from "./Player";
import { formatPercent, inlineCode, SILVER } from "./utils";


export abstract class Armor {
  abstract name: string;
  abstract id: string;
  owner?: Player;
  imageUrl?: string;
  armor = 0.05;

  show() {
    const armorRate = formatPercent(this.armor);

    const embed = new MessageEmbed()
      .setTitle("Armor")
      .setColor(SILVER)
      .addField("Armor", inlineCode(armorRate))

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }
}
