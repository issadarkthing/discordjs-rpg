import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Battle } from "../../Battle";
import { Player } from "../../Player";

export default class BattleCommand extends Command {
  name = "battle";
  aliases = ["b"];

  async exec(msg: Message, args: string[]) {

    const author = new Player(msg.member!);
    const opponents = msg.mentions.members?.map(x => new Player(x));

    if (!opponents)
      return msg.channel.send("Please mention your opponent(s)");

    author.attack = 30;

    const battle = new Battle(msg, [author, ...opponents]);
    await battle.run();
  }
}
