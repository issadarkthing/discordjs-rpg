import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Fighter } from ".";
import { BaseBattle } from "./BaseBattle";
import cloneDeep from "lodash.clonedeep";
import { GOLD, isEven, random } from "./utils";

interface Team {
  name: string;
  fighters: Fighter[];
}

/** 
 * TeamBattle handles team battle simulation
 * */
export class TeamBattle extends BaseBattle {
  private teamA: Team;
  private teamB: Team;
  interval = 1000; // reduce the time interval

  /** 
   * @param {CommandInteraction} i - Discord.js CommandInteraction
   * @param {Team} teamA - team
   * @param {Team} teamB - team
   * */
  constructor(i: CommandInteraction, teamA: Team, teamB: Team) {
    super(i, [...teamA.fighters, ...teamB.fighters]);

    this.teamA = { ...teamA, fighters: teamA.fighters.map(x => cloneDeep(x)) };
    this.teamB = { ...teamB, fighters: teamB.fighters.map(x => cloneDeep(x)) };
  }

  /** 
   * Starts the battle simulation. It will throw error if the array of
   * Fighters is less than 2. This method will return the Fighter object who won
   * the battle.
   * 
   * @returns Team
   * 
   * */
  async run() {

    if (this.fighters.length <= 1)
      throw new Error("cannot battle with 1 or less player");

    await this.reply("Starting battle");
    const teamAlength = this.teamA.fighters.length;
    const fighters = [...this.teamA.fighters, ...this.teamB.fighters];

    while (this.teamA.fighters.length !== 0 && this.teamB.fighters.length !== 0) {
      this.round++;

      const attackTeam = isEven(this.round) ? this.teamA : this.teamB;
      const defendTeam = isEven(this.round) ? this.teamB : this.teamA;

      const player = attackTeam.fighters.shift()!;
      let opponent = random.pick(defendTeam.fighters);

      const playerSkillIntercept = player.skill?.intercept();
      const opponentSkillIntercept = opponent.skill?.intercept();

      if (playerSkillIntercept) {
        const skillEmbed = player.skill!.use(player, opponent);

        await this.updateEmbed(skillEmbed);
        this.showBattle && await this.sleep();
      }

      if (opponentSkillIntercept) {
        const skillEmbed = opponent.skill!.use(opponent, player);

        await this.updateEmbed(skillEmbed);
        this.showBattle && await this.sleep();
      }

      if (player.pet?.isIntercept()) {
        const petEmbed = player.pet.intercept(opponent);

        await this.updateEmbed(petEmbed);
        this.showBattle && await this.sleep();
      }

      const battleEmbed = this.attack(player, opponent);
      battleEmbed.setTitle(`${attackTeam.name} is attacking`);

      for (let i = 0; i < this.fighters.length; i++) {
        const p1 = this.fighters[i];
        const currHealth = fighters.find(x => x.id === p1.id)?.hp;

        if (i === 0) {
          battleEmbed.addFields({ name: "\u200b", value: `**${this.teamA.name}**` });
        } else if (i === teamAlength) {
          battleEmbed.addFields({ name: "\u200b", value: `**${this.teamB.name}**` });
        }

        if (currHealth !== undefined) {
          this.progressBar(battleEmbed, p1.name, currHealth, p1.hp);
        }
      }

      await this.updateEmbed(battleEmbed);

      attackTeam.fighters.push(player);

      if (opponent.hp <= 0) {
        const index = defendTeam.fighters.findIndex(x => x.id === opponent.id);
        defendTeam.fighters.splice(index, 1);

        let text = `${opponent.name} has died in the battle`;
        if (this.playerDiedText) {
          text = this.playerDiedText(opponent);
        }

        this.reply(text);
        this.logBattle && console.log(text);

        if (defendTeam.fighters.length === 0) break;
      } 

      if (playerSkillIntercept) {
        player.skill!.close(player, opponent);
      }

      if (opponentSkillIntercept) {
        opponent.skill!.close(opponent, player);
      }

      this.showBattle && await this.sleep();
    }

    const winner = this.teamA.fighters.length > 0 ? this.teamA : this.teamB;

    const winEmbed = new EmbedBuilder()
      .setColor(GOLD)
      .setTitle("Battle Winner")
      .setDescription(`${winner.name} has won the battle!`);


    this.reply(winEmbed);
    return winner;
  }
}
