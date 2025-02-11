import { Command } from "@jiman24/slash-commandment";
import { CommandError } from "@jiman24/slash-commandment/dist/Error";
import { CommandInteraction } from "discord.js";
import { Chest } from "../../Armor";
import { Battle } from "../../Battle";
import { Dragon } from "../../Pet";
import { Player } from "../../Player";
import { Rage } from "../../Skill";


export default class BattleCommand extends Command {
  name = "battle";
  description: string = "sample";
  aliases = ["b"];

  constructor() {
    super();

    this.addUserOption(option => 
      option
        .setName("player")
        .setDescription("player you want to fight")
        .setRequired(true)
    )
  }

  async exec(i: CommandInteraction) {

    const author = new Player(i.user);
    const opponent = i.options.get("player", true).user;

    if (!opponent)
      throw new CommandError("Please mention your opponent(s)");

    author.skill = new Rage();

    const pet = new Dragon();
    pet.setOwner(author);

    const chest = new Chest();
    author.equipArmor(chest);

    const opponentPlayer = new Player(opponent);
    const battle = new Battle(i, [author, opponentPlayer]);

    await battle.run();
  }
}
