import { oneLine } from "common-tags";
import { MessageEmbed } from "discord.js";
import { Base } from "./Base";
import { Fighter } from "./Fighter";
import { Player } from "./Player";
import { bold, BROWN, formatPercent, inlineCode, random } from "./utils";


export abstract class Pet extends Base {
  owner?: Player;
  imageUrl?: string;
  interceptRate = 0.05;
  attack = 5;

  isIntercept() {
    return random().bool(this.interceptRate);
  }

  setOwner(player: Player) {
    player.pet = this;
    this.owner = player;
  }

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

export class Dragon extends Pet {
  name = "dragon";
  id = "dragon";
  attack = 20;
  interceptRate = 0.4;
}
