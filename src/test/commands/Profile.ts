import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Chest } from "../../Armor";
import { Dragon } from "../../Pet";
import { Player } from "../../Player";
import { Rage } from "../../Skill";


export default class Profile extends Command {
  name = "profile";
  aliases = ["p"];

  async exec(msg: Message, args: string[]) {

    const player = new Player(msg.author);
    player.skill = new Rage();

    const pet = new Dragon();
    pet.setOwner(player);

    const chest = new Chest();
    player.equipArmor(chest);
    
    msg.channel.send({ embeds: [player.show()] });
  }
}
