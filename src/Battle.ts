import { Message, MessageEmbed } from "discord.js";
import { GOLD, random, RED, sleep } from "./utils";
import { Fighter } from "./Fighter";
import cloneDeep from "lodash.clonedeep";

/** 
 * Battle handles all battle simulation using discord.js's embed. 
 * */
export class Battle {
  private round = 0;
  private msg: Message;
  private fighters: Fighter[];
  private boss?: Fighter;
  private playerDiedText: string | null = null;
  /** Time interval to change to next frame (in milliseconds by default is 6000) */
  interval = 6000;

  /** 
   * @param {Message} msg - discord.js's Message object
   * @param {Fighter[]} fighters - array of Fighter's object
   * */
  constructor(msg: Message, fighters: Fighter[]) {
    this.msg = msg;
    this.fighters = [...new Set(fighters)];
  }

  private bar(progress: number, maxProgress: number) {
    if (progress < 0) progress = 0;

    const maxFill = 20;
    const fill = "█";
    const path = " ";
    const fillProgress = Math.round((progress * maxFill) / maxProgress);

    return Array(maxFill)
      .fill(fill)
      .map((v, i) => (fillProgress > i ? v : path))
      .join("");
  }

  /** adds progress bar to battleEmbed */ 
  private progressBar(
    embed: MessageEmbed, name: string, hp: number, maxHP: number,
  ) {

    const maxHPStr = Math.round(maxHP);
    const healthBar = this.bar(hp, maxHP);
    const remainingHP = hp >= 0 ? Math.round(hp) : 0;

    embed.addField(
      `${name}'s remaining HP`,
      `\`${healthBar}\` \`${remainingHP}/${maxHPStr}\``
    );
  }

  private attack(p1: Fighter, p2: Fighter) {
    const isCrit = p1.isCrit();
    const attackRate = isCrit ? p1.attack * p1.critDamage : p1.attack;
    const armorProtection = p2.armor * attackRate;
    const damageDealt = attackRate - armorProtection;
    const critText = isCrit ? ` (x${p1.critDamage.toFixed(1)}) 🔥` : "";

    p2.hp -= damageDealt;

    const battleEmbed = new MessageEmbed()
      .setColor(RED)
      .addField("Attacking Player", p1.name, true)
      .addField("Defending Player", p2.name, true)
      .addField("Round", `\`${this.round.toString()}\``, true)
      .addField("Attack Rate", `\`${Math.round(attackRate)}${critText}\``, true)
      .addField("Damage Reduction", `\`${Math.round(armorProtection)}\``, true)
      .addField("Damage Done", `\`${Math.round(damageDealt)}\``, true);

    if (p1.imageUrl)
      battleEmbed.setThumbnail(p1.imageUrl)

    return battleEmbed;
  }

  /** 
   * Changes the discord.js message sent when player dies in the battle.
   * */
  setPlayerDeadText(text: string) {
    this.playerDiedText = text; 
  }

  /** 
   * Change the battle to raid mode. Raid mode only have one opponent that is
   * the boss. If the boss dies, the battle ends.
   *
   * @param {Fighter} - Boss to be defeated
   * */
  setBoss(boss: Fighter) {
    this.boss = boss;
    return this;
  }

  /** 
   * Sets the battle scene interval.
   *
   * @param {number} - time in milliseconds 
   * */
  setInterval(ms: number) {
    this.interval = ms;
    return this;
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

        const text = this.playerDiedText || `${opponent.name} has died in the battle`;
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
