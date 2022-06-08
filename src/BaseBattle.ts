import { MessageEmbed, CommandInteraction, MessagePayload, MessageOptions } from "discord.js";
import { RED, sleep } from "./utils";
import { Fighter } from "./Fighter";

export abstract class BaseBattle {
  protected round = 0;
  protected i: CommandInteraction;
  protected fighters: Fighter[];
  protected damageDealt: Map<string, number> = new Map();
  protected playerDiedText?: (fighter: Fighter) => string;
  /** Time interval to change to next frame (in milliseconds by default is 6000) */
  interval = 4000;

  /** Show battle embed */
  showBattle = true;

  /** Logs battle to stdout */
  logBattle = false;

  /** 
   * @param {CommandInteraction} i - discord.js's CommandInteraction
   * @param {Fighter[]} fighters - array of Fighter's object
   * */
  constructor(i: CommandInteraction, fighters: Fighter[]) {
    this.i = i;
    this.fighters = [...new Set(fighters)];
  }

  protected sleep() {
    return sleep(this.interval);
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

  protected async reply(options: string | MessageEmbed) {
    let content: { content?: string, embeds?: MessageEmbed[] };

    if (options instanceof MessageEmbed) {
      content = { embeds: [options] };
    } else {
      content = { content: options }
    }

    if (this.i.replied) {
      await this.i.editReply(content)
    } else {
      await this.i.reply(content);
    }
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
      battleEmbed.setThumbnail(p1.imageUrl);

    const totalDamageDealt = this.damageDealt.get(p1.id) || 0;

    this.damageDealt.set(p1.id, totalDamageDealt + damageDealt);

    return battleEmbed;
  }

  /** 
   * Gets total damage dealt for a particular fighter
   * */
  getDamageDealt(id: string) {
    return this.damageDealt.get(id);
  }

  /** 
   * Gets fighters. Usually used to get the remaining HP
   * */
  getFighters() {
    return this.fighters;
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
   * @param ms {number} - time in milliseconds 
   * */
  setInterval(ms: number) {
    this.interval = ms;
    return this;
  }

  private getEmbedInfo(embed: MessageEmbed) {

    let result = embed.description ? `\nDescription: ${embed.description}` : "";

    for (const field of embed.fields) {
      result += `\n${field.name}: ${field.value}`;
    }

    return result;
  }

  /** 
   * Updates embed and log if enabled.
   * */
  protected async updateEmbed(embed: MessageEmbed) {
    this.logBattle && console.log(this.getEmbedInfo(embed));
    this.showBattle && await this.reply(embed);
  }
}
