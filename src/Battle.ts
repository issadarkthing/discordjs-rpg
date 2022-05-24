import { MessageEmbed } from "discord.js";
import { GOLD, random, sleep } from "./utils";
import { Fighter } from "./Fighter";
import cloneDeep from "lodash.clonedeep";
import { BaseBattle } from "./BaseBattle";

/** 
 * Battle handles all battle simulation using discord.js's embed. 
 * */
export class Battle extends BaseBattle {
  protected boss?: Fighter;
  onFighterDead?: (fighter: Fighter) => void;

  /** Time interval to change to next frame (in milliseconds by default is 6000) */
  interval = 4000;

  /** 
   * Change the battle to raid mode. Raid mode only have one opponent that is
   * the boss. If the boss dies, the battle ends.
   *
   * @param boss {Fighter} - Boss to be defeated
   * */
  setBoss(boss: Fighter) {
    this.boss = boss;
    return this;
  }

  /** 
   * Executes callback when Fighter dead during battle.
   * */
  setOnFighterDead(cb: (fighter: Fighter) => void) {
    this.onFighterDead = cb;
  }

  /** 
   * Starts the battle simulation. It will throw error if the array of
   * Fighters is less than 2. This method will return the Fighter object who won
   * the battle.
   * 
   * @returns Fighter
   * 
   * */
  async run() {

    if (this.fighters.length <= 1)
      throw new Error("cannot battle with 1 or less player");

    const battleQueue = this.fighters.map(x => cloneDeep(x));
    const message = await this.msg.channel.send("Starting battle");

    while (battleQueue.length !== 1) {
      this.round++;

      const player = battleQueue.shift()!;
      let opponent = random.pick(battleQueue);

      const boss = this.boss;
      if (boss && player.id !== boss.id) {
        const bossState = battleQueue.find(x => x.id === boss.id);
        if (bossState) {
          opponent = bossState;
        } else {
          break;
        }
      }

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

      for (const p1 of this.fighters) {
        const currHealth = [player, ...battleQueue].find(x => x.id === p1.id)?.hp;
        if (currHealth !== undefined) {
          this.progressBar(battleEmbed, p1.name, currHealth, p1.hp);
        }
      }

      await message.edit({ embeds: [battleEmbed] });

      battleQueue.push(player);

      if (opponent.hp <= 0) {
        const index = battleQueue.findIndex(x => x.id === opponent.id);
        battleQueue.splice(index, 1);

        let text = `${opponent.name} has died in the battle`;
        if (this.playerDiedText) {
          text = this.playerDiedText(opponent);
        }

        this.onFighterDead && this.onFighterDead(opponent);
        this.msg.channel.send(text);

        if (battleQueue.length === 1) break;
      } 

      if (playerSkillIntercept) {
        player.skill!.close(player, opponent);
      }

      if (opponentSkillIntercept) {
        opponent.skill!.close(opponent, player);
      }

      await sleep(this.interval);
    }

    const winner = battleQueue[0];

    const boss = this.boss;
    // if the boss loses
    if (boss && winner.id !== boss.id) {
      const winEmbed = new MessageEmbed()
        .setColor(GOLD)
        .setTitle("Raid Successfull")
        .setDescription(`${boss.name} has been defeated!`);

      if (boss.imageUrl)
        winEmbed.setThumbnail(boss.imageUrl);

      await message.edit({ embeds: [winEmbed] });
      return this.fighters.find(x => x.id === winner.id)!;
    }

    const winEmbed = new MessageEmbed()
      .setColor(GOLD)
      .setTitle("Battle Winner")
      .setDescription(`${winner.name} has won the battle!`);

    if (winner.imageUrl)
      winEmbed.setThumbnail(winner.imageUrl);

    message.edit({ embeds: [winEmbed] });
    return this.fighters.find(x => x.id === winner.id)!;
  }
}
