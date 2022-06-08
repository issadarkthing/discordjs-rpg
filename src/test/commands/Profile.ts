import { Command } from "@jiman24/slash-commandment";
import { CommandInteraction } from "discord.js";
import { Chest } from "../../Armor";
import { Dragon } from "../../Pet";
import { Player } from "../../Player";
import { Rage } from "../../Skill";
import { Sword } from "../../Weapon";

export default class extends Command {
  name = "profile";
  description = "sample";
  aliases = ["p"];

  async exec(i: CommandInteraction) {

    const player = new Player(i.user);
    player.skill = new Rage();

    const pet = new Dragon();
    pet.setOwner(player);

    const chest = new Chest();
    player.equipArmor(chest);

    const sword = new Sword();
    player.equipWeapon(sword);
    
    i.reply({ embeds: [player.show()] });
  }
}
