import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Chest } from "../../Armor";
import { Battle } from "../../Battle";
import { Dragon } from "../../Pet";
import { Player } from "../../Player";
import { Rage } from "../../Skill";


export default class BattleCommand extends Command {
  name = "battle";
  aliases = ["b"];

  async exec(msg: Message, args: string[]) {

    const author = new Player(msg.author);
    const opponents = msg.mentions.users.map(x => new Player(x));

    if (!opponents)
      return msg.channel.send("Please mention your opponent(s)");

    author.skill = new Rage();

    const pet = new Dragon();
    pet.setOwner(author);

    const chest = new Chest();
    author.equipArmor(chest);

    const battle = new Battle(msg, [author, ...opponents]);
    await battle.run();
  }
}
