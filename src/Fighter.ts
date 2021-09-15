import { MessageEmbed } from "discord.js";
import { Armor } from "./Armor";
import { Base } from "./Base";
import { deepCopy } from "./deepCopy";
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
    return deepCopy(source) as Fighter;
  }

  show() {
    const armor = formatPercent(this.armor);
    const critChance = formatPercent(this.critChance);

    const embed = new MessageEmbed()
      .setTitle("Profile")
      .setColor(GOLD)
      .addField("Name", this.name)
      .addField("Attack", inlineCode(this.attack.toString()), true)
      .addField("HP", inlineCode(this.hp.toString()), true)
      .addField("Armor", inlineCode(armor), true)
      .addField("Crit Chance", inlineCode(critChance), true)
      .addField("Crit Damage", inlineCode(`x${this.critDamage}`), true)

    if (this.imageUrl)
      embed.setThumbnail(this.imageUrl);

    return embed;
  }
}
