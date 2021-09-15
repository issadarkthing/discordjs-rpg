import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Armor } from "../../Armor";
import { Battle } from "../../Battle";
import { Pet } from "../../Pet";
import { Player } from "../../Player";
import { Rage } from "../../Skill";

class Dragon extends Pet {
  name = "dragon";
  id = "dragon";
  attack = 20;
  interceptRate = 0.4;
}

class Chest extends Armor {
  name = "chest";
  id = "chest";
  armor = 0.8;
}

export default class BattleCommand extends Command {
  name = "battle";
  aliases = ["b"];

  async exec(msg: Message, args: string[]) {

    const author = new Player(msg.member!);
    const opponents = msg.mentions.members?.map(x => new Player(x));

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
