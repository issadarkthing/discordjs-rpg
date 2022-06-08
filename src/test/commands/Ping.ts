import { CommandInteraction } from "discord.js";
import { Command } from "@jiman24/slash-commandment";

export default class extends Command {
  name = "ping";
  description = "sample";
  throttle = 10 * 1000; // 10 seconds

  async exec(i: CommandInteraction) {
    i.reply("pong");
  }
}
