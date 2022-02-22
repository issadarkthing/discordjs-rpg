import { Message, MessageEmbed } from "discord.js";
import { Fighter } from ".";
import { BaseBattle } from "./BaseBattle";
import cloneDeep from "lodash.clonedeep";
import { GOLD, isEven, random, sleep } from "./utils";

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
   * @param {Message} msg - discord.js's Message object
   * @param {Team} teamA - team
   * @param {Team} teamB - team
   * */
  constructor(msg: Message, teamA: Team, teamB: Team) {
    super(msg, [...teamA.fighters, ...teamB.fighters]);

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

    const message = await this.msg.channel.send("Starting battle");
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
        await message.edit({ embeds: [skillEmbed] });
        await sleep(this.interval);
      }

      if (opponentSkillIntercept) {
        const skillEmbed = opponent.skill!.use(opponent, player);
        await message.edit({ embeds: [skillEmbed] });
        await sleep(this.interval);
      }

      if (player.pet?.isIntercept()) {
        const petEmbed = player.pet.intercept(opponent);
        await message.edit({ embeds: [petEmbed] });
        await sleep(this.interval);
      }

      const battleEmbed = this.attack(player, opponent);
      battleEmbed.setTitle(`Team ${attackTeam.name} is attacking`);

      for (const p1 of this.fighters) {
        const currHealth = fighters.find(x => x.id === p1.id)?.hp;
        if (currHealth !== undefined) {
          this.progressBar(battleEmbed, p1.name, currHealth, p1.hp);
        }
      }

      await message.edit({ embeds: [battleEmbed] });

      attackTeam.fighters.push(player);

      if (opponent.hp <= 0) {
        const index = defendTeam.fighters.findIndex(x => x.id === opponent.id);
        defendTeam.fighters.splice(index, 1);

        let text = `${opponent.name} has died in the battle`;
        if (this.playerDiedText) {
          text = this.playerDiedText(opponent);
        }

        this.msg.channel.send(text);

        if (defendTeam.fighters.length === 0) break;
      } 

      if (playerSkillIntercept) {
        player.skill!.close(player, opponent);
      }

      if (opponentSkillIntercept) {
        opponent.skill!.close(opponent, player);
      }

      await sleep(this.interval);
    }

    const winner = this.teamA.fighters.length > 0 ? this.teamA : this.teamB;

    const winEmbed = new MessageEmbed()
      .setColor(GOLD)
      .setTitle("Battle Winner")
      .setDescription(`Team ${winner.name} has won the battle!`);


    message.edit({ embeds: [winEmbed] });
    return winner;
  }
}
