import { EmbedBuilder } from "discord.js";


/** Base class which every entity must extend */
export abstract class Base {
  /** The name of the entity */
  abstract name: string;
  /** 
   * The unique id of the entity. Please ensure this id does not contain any
   * spaces 
   * */
  abstract id: string;
  /** MessageEmbed which represents the entity */
  abstract show(): EmbedBuilder;
}
