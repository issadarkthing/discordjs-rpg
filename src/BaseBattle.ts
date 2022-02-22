import { Message, MessageEmbed } from "discord.js";
import { RED } from "./utils";
import { Fighter } from "./Fighter";

export abstract class BaseBattle {
  protected round = 0;
  protected msg: Message;
  protected fighters: Fighter[];
  protected playerDiedText?: (fighter: Fighter) => string;
  /** Time interval to change to next frame (in milliseconds by default is 6000) */
  interval = 4000;

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
  protected progressBar(
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

  protected attack(p1: Fighter, p2: Fighter) {
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
  setPlayerDeadText(text: (fighter: Fighter) => string) {
    this.playerDiedText = text; 
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
}
