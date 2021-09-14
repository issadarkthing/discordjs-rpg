import { GuildMember } from "discord.js";
import { Pet } from "./Pet";
import { random } from "./utils";

export class Player {
  name: string;
  attack = 10;
  hp = 100;
  armor = 0.1;
  critChance = 0.3;
  critDamage = 1.2;
  member: GuildMember;
  pet?: Pet;

  constructor(member: GuildMember) {
    this.member = member;
    this.name = member.displayName;
  }

  get id() {
    return this.member.id;
  }

  get imageUrl() {
    return this.member.user.displayAvatarURL();
  }

  isCrit() {
    return random().bool(this.critChance);
  }

  copy() {
    const source = new Player(this.member);
    Object.assign(source, this);
    return source;
  }
}
