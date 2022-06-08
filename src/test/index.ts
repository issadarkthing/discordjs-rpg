import { Client } from "discord.js";
import { CommandManager } from "@jiman24/slash-commandment";
import path from "path";
import { config } from "dotenv";

config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const commandManager = new CommandManager({
  client,
  devGuildID: "899466085735223337",
});

commandManager.verbose = true;


client.on("ready", () => { 
  console.log(client.user?.username, "is ready!");
  commandManager.registerCommands(path.resolve(__dirname, "./commands"));
});

client.on("interactionCreate", i => { 
  commandManager.handleInteraction(i);
});

client.login(process.env.BOT_TOKEN);
