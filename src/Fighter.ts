import { MessageEmbed } from "discord.js";
import { Armor } from "./Armor";
import { Base } from "./Base";
import cloneDeep from "lodash.clonedeep";
import { Pet } from "./Pet";
import { Skill } from "./Skill";
import { formatPercent, GOLD, inlineCode, random } from "./utils";

/** 
 * Fighter is base class to be used in Battle. Only class derived from Fighter
 * can be used in Battle.
 *
 * ```typescript
 * class Monster extends Fighter {
 *    name = "boogy man";
 *    id = "boogy_man";
 *    attack = 20;
 * }
 * ```
 * */
export class Fighter extends Base {
  /** Fighter name */
  name: string;
  /** Fighter unique id */
  id: string;
  /** Damage dealt when attack */
  attack = 10;
  /** Fighter's health point */
  hp = 100;
  /** Amount of damage blocked when Fighter gets attacked*/
  armor = 0.1;
  /** Percentage to get critical attack */
  critChance = 0.3;
  /** Critical attack percentage increment */
  critDamage = 1.2;
  private equippedArmors: Armor[] = [];
  /** Fighter's Skill */
  skill?: Skill;
  /** Fighter's Pet */
  pet?: Pet;
  /** Image to represent this Fighter */
  imageUrl?: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.id = name;
  }

  /** Add new armor to the user */
  equipArmor(armor: Armor) {
    this.armor += armor.armor;
    this.equippedArmors.push(armor);
  }

  /** Returns true if critical attack */
  isCrit() {
    return random().bool(this.critChance);
  }

  /** To be used internally */
  copy() {
    const source = new Fighter(this.name);
    return cloneDeep(source);
  }

  /** MessageEmbed that represents this Fighter */
  show() {
    const armor = formatPercent(this.armor);
    const critChance = formatPercent(this.critChance);

    const armorList = this.equippedArmors
      .map((x, i) => `${i + 1}. ${x.name}`)
      .join("\n");

    const embed = new MessageEmbed()
      .setTitle("Profile")
      .setColor(GOLD)
      .addField("Name", this.name)
      .addField("Attack", inlineCode(Math.round(this.attack).toString()), true)
      .addField("HP", inlineCode(Math.round(this.hp).toString()), true)
      .addField("Armor", inlineCode(armor), true)
      .addField("Crit Chance", inlineCode(critChance), true)
      .addField("Crit Damage", inlineCode(`x${this.critDamage.toFixed(1)}`), true)
      .addField("Skill", this.skill?.name || "none", true)
      .addField("Pet", this.pet?.name || "none", true)
      .addField("Armor", armorList || "none")

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }
}
