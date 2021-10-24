import { User } from "discord.js";
import { Fighter } from "./Fighter";

/** 
 * Player extends Fighter and it used to easily create Fighter class based on
 * discord.js User.
 * */
export class Player extends Fighter {
  id: string;
  attack = 10;
  hp = 100;
  armor = 0.1;
  critChance = 0.3;
  critDamage = 1.2;
  user: User;

  /** Creates Player instance from User */
  constructor(user: User) {
    super(user.username);
    this.user = user;
    this.id = user.id;
    this.imageUrl = this.user.displayAvatarURL();
  }
}
