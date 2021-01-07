const { token, prefix } = require("./config.json");

const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client();

client.commands = new Discord.Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
})

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
        message.reply(`Je ne possède pas cette commande: ${command}`);
    }
    try {
        client.commands.get(command).execute(message, args, client);
    }
    catch (error) {
        console.log(error);
    }
})

client.login(token)
