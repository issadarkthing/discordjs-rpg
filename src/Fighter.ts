import { Armor } from "./Armor";
import { random } from "./utils";

export class Fighter {
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
    Object.assign(source, this);
    return source;
  }
}
