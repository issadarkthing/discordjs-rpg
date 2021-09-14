import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../../Player";


export default class Profile extends Command {
  name = "profile";
  aliases = ["p"];

  async exec(msg: Message, args: string[]) {

    const player = new Player(msg.member!);
    msg.channel.send({ embeds: [player.show()] });
  }
}
