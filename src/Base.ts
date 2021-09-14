import { MessageEmbed } from "discord.js";


export abstract class Base {
  abstract name: string;
  abstract id: string;
  abstract show(): MessageEmbed;
}
