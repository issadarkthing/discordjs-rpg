import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Fighter } from "../..";
import { TeamBattle } from "../../TeamBatle";

export default class extends Command {
  name = "team";

  async exec(msg: Message) {

    const teamA = { 
      name: "A", 
      fighters: [new Fighter("eren"), new Fighter("mikasa")],
    }

    const teamB = {
      name: "B",
      fighters: [new Fighter("jean"), new Fighter("annie")],
    }

    const battle = new TeamBattle(msg, teamA, teamB);

    await battle.run();
  }
}
