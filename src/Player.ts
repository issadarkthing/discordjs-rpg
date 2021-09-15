import { GuildMember } from "discord.js";
import { deepCopy } from "./deepCopy";
import { Fighter } from "./Fighter";

export class Player extends Fighter {
  id: string;
  attack = 10;
  hp = 100;
  armor = 0.1;
  critChance = 0.3;
  critDamage = 1.2;
  member: GuildMember;

  constructor(member: GuildMember) {
    super(member.displayName);
    this.member = member;
    this.id = member.id;
    this.imageUrl = this.member.user.displayAvatarURL();
  }

  copy() {
    const source = new Player(this.member);
    return deepCopy(source) as Player;
  }
}
