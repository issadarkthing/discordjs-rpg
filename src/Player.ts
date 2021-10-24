import { User } from "discord.js";
import cloneDeep from "lodash.clonedeep";
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

  copy() {
    const source = new Player(this.user);
    return cloneDeep(source);
  }
}
