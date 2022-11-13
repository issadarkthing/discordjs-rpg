import { Command } from "@jiman24/slash-commandment";
import { CommandInteraction } from "discord.js";
import { Pet } from "../../Pet";
import { Player } from "../../Player";

class Dragon extends Pet {
  name = "drag";
  id = "drag";
}

export default class extends Command {
  name = "pet";
  description: string = "sample";
  aliases = [];

  async exec(i: CommandInteraction) {
    await i.deferReply();

    const author = new Player(i.user);
    const pet = new Dragon();
    pet.setOwner(author);
    pet.imageUrl = "https://cdn.discordapp.com/attachments/574852830125359126/863997311532007475/8edc1273be7f8b1c4be3d72af3358e9b.png";

    author.pet = pet;

    const petEmbed = pet.show();

    i.editReply({ embeds: [petEmbed] });
  }
}
