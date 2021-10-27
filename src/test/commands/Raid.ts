import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Chest } from "../../Armor";
import { Battle } from "../../Battle";
import { Dragon } from "../../Pet";
import { Player } from "../../Player";
import { Rage } from "../../Skill";
import { Fighter } from "../../Fighter";

export default class extends Command {
  name = "raid";

  async exec(msg: Message, args: string[]) {

    const author = new Player(msg.author);
    const bots = [
      new Fighter("Michael"),
      new Fighter("Mansion"),
      new Fighter("John"),
    ];

    const boss = new Fighter("Boogey Man");
    boss.hp = 1000;
    boss.attack = 50;
    boss.critChance = 0.4;

    author.skill = new Rage();

    const pet = new Dragon();
    pet.setOwner(author);

    const chest = new Chest();
    author.equipArmor(chest);

    const battle = new Battle(msg, [author, boss, ...bots]);

    battle.setBoss(boss);

    await battle.run();
  }
}
