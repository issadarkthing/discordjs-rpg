import { oneLine } from "common-tags";
import { MessageEmbed } from "discord.js";
import { Base } from "./Base";
import { Fighter } from "./Fighter";
import { Player } from "./Player";
import { GREEN, inlineCode, random } from "./utils";


export abstract class Skill extends Base {
  abstract description: string; 
  interceptRate = 0.2;
  imageUrl?: string;
  owner?: Player;

  /** to mutate the fighter's attributes */
  abstract use(player: Fighter, opponent: Fighter): MessageEmbed;

  /** to clean up or remove any attribute changes before next round */
  abstract close(player: Fighter, opponent: Fighter): void;

  intercept() {
    return random().bool(this.interceptRate);
  }

  show() {
    const embed = new MessageEmbed()
      .setTitle("Skill")
      .setColor(GREEN)
      .addField("Name", this.name)
      .addField("Description", this.description)

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }
}

export class Rage extends Skill {
  name = "Rage";
  id = "rage";
  description = "Does double damage";

  use(p1: Fighter, p2: Fighter) {
    p1.attack *= 2;

    const embed = new MessageEmbed()
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
