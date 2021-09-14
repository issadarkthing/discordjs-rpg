import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Pet } from "../../Pet";
import { Player } from "../../Player";

export default class PetCommand extends Command {
  name = "pet";
  aliases = [];

  async exec(msg: Message, args: string[]) {

    const author = new Player(msg.member!);
    const pet = new Pet("yenyen");
    pet.owner = author;
    author.pet = pet;

    const petEmbed = pet.show();

    msg.channel.send({ embeds: [petEmbed] });
  }
}
