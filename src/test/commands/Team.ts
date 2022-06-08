import { Command } from "@jiman24/slash-commandment";
import { CommandInteraction } from "discord.js";
import { Fighter } from "../..";
import { TeamBattle } from "../../TeamBatle";

export default class extends Command {
  name = "team";
  description = "sample";

  async exec(i: CommandInteraction) {

    const teamA = { 
      name: "Jaegerist", 
      fighters: [new Fighter("eren"), new Fighter("mikasa")],
    }

    const teamB = {
      name: "Anti-Jaegerist",
      fighters: [new Fighter("jean"), new Fighter("annie")],
    }

    const battle = new TeamBattle(i, teamA, teamB);

    await battle.run();
  }
}
