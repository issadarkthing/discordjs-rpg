import { EmbedBuilder, CommandInteraction } from "discord.js";
import { RED, sleep } from "./utils";
import { Fighter } from "./Fighter";

interface PlayerGameStat {
  totalDamageDealt: number;
  remainingHP: number;
}

export abstract class BaseBattle {
  protected round = 0;
  protected i: CommandInteraction;
  protected fighters: Fighter[];
  protected gameStats: Map<string, PlayerGameStat> = new Map();
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

  protected async reply(options: string | EmbedBuilder) {
    let content: { content?: string, embeds?: EmbedBuilder[] };

    if (options instanceof EmbedBuilder) {
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
    embed: EmbedBuilder, name: string, hp: number, maxHP: number,
  ) {

    const maxHPStr = Math.round(maxHP);
    const healthBar = this.bar(hp, maxHP);
    const remainingHP = hp >= 0 ? Math.round(hp) : 0;

    embed.addFields([
      { 
        name: `${name}'s remaining HP`,
        value: `\`${healthBar}\` \`${remainingHP}/${maxHPStr}\``,
      },
    ]);
  }

  protected attack(p1: Fighter, p2: Fighter) {
    const isCrit = p1.isCrit();
    const attackRate = isCrit ? p1.attack * p1.critDamage : p1.attack;
    const armorProtection = p2.armor * attackRate;
    const damageDealt = attackRate - armorProtection;
    const critText = isCrit ? ` (x${p1.critDamage.toFixed(1)}) 🔥` : "";

    p2.hp -= damageDealt;

    const battleEmbed = new EmbedBuilder()
      .setColor(RED)
      .setFields([
        { name: "Attacking Player", value: p1.name, inline: true },
        { name: "Defending Player", value: p2.name, inline: true },
        { name: "Round", value: `\`${this.round.toString()}\``, inline: true },
        { name: "Attack Rate", value: `\`${Math.round(attackRate)}${critText}\``, inline: true },
        { name: "Damage Reduction", value: `\`${Math.round(armorProtection)}\``, inline: true },
        { name: "Damage Done", value: `\`${Math.round(damageDealt)}\``, inline: true },
      ]);

    if (p1.imageUrl)
      battleEmbed.setThumbnail(p1.imageUrl);

    const p1Stat = this.gameStats.get(p1.id);
    
    if (p1Stat) {

      this.gameStats.set(p1.id, {
        remainingHP: p1.hp,
        totalDamageDealt: p1Stat.totalDamageDealt + damageDealt,
      });

    } else {

      this.gameStats.set(p1.id, { 
        remainingHP: p1.hp, 
        totalDamageDealt: damageDealt,
      });

    }

    const p2Stat = this.gameStats.get(p2.id);

    if (p2Stat) {

      this.gameStats.set(p2.id, {
        ...p2Stat,
        remainingHP: p2.hp,
      })

    } else {

      this.gameStats.set(p2.id, {
        remainingHP: p2.hp,
        totalDamageDealt: 0,
      });
    }


    return battleEmbed;
  }

  /** 
   * Gets total damage dealt for a particular fighter
   * */
  getDamageDealt(id: string) {
    return this.gameStats.get(id)?.totalDamageDealt;
  }

  /** 
   * Get remaining HP for a particular fighter
   * */
  getRemainingHP(id: string) {
    return this.gameStats.get(id)?.remainingHP;
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

  private getEmbedInfo(embed: EmbedBuilder) {

    let result = embed.data.description ? `\nDescription: ${embed.data.description}` : "";

    for (const field of embed.data.fields!) {
      result += `\n${field.name}: ${field.value}`;
    }

    return result;
  }

  /** 
   * Updates embed and log if enabled.
   * */
  protected async updateEmbed(embed: EmbedBuilder) {
    this.logBattle && console.log(this.getEmbedInfo(embed));
    this.showBattle && await this.reply(embed);
  }
}
