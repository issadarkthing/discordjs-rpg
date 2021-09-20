import { MessageEmbed } from "discord.js";
import { Armor } from "./Armor";
import { Base } from "./Base";
import cloneDeep from "lodash.clonedeep";
import { Pet } from "./Pet";
import { Skill } from "./Skill";
import { formatPercent, GOLD, inlineCode, random } from "./utils";

export class Fighter extends Base {
  name: string;
  id: string;
  attack = 10;
  hp = 100;
  armor = 0.1;
  critChance = 0.3;
  critDamage = 1.2;
  equippedArmors: Armor[] = [];
  skill?: Skill;
  pet?: Pet;
  imageUrl?: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.id = name;
  }

  equipArmor(armor: Armor) {
    this.armor += armor.armor;
    this.equippedArmors.push(armor);
  }

  isCrit() {
    return random().bool(this.critChance);
  }

  copy() {
    const source = new Fighter(this.name);
    return cloneDeep(source);
  }

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
