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

client.on("messageReactionAdd", (reaction, user) => {
    if (user.bot) {
        return;
    }
    const { message } = reaction
    
    if (reaction.emoji.name === "🎟️") {
        reaction.users.remove(user.id)
        message.guild.channels.create(`${user.id}-ticket`, {
            permissionOverwrites: [
                {
                    deny: "VIEW_CHANNEL",
                    id: message.guild.id
                },
                {
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "ADD_REACTIONS"],
                    id: user.id
                }
            ]
        })
        .then(ch => {
            const e = new Discord.MessageEmbed()
            .setTitle("Nouveau Ticket")
            .setColor("#2F3136")
            .setDescription(`User: ${user.tag}\nID: ${user.id}`)
            .setFooter("Pour fermer le ticket merci de cliquer sur la reaction ci dessous.")

            ch.send(e)
            .then(msg => {
                msg.react("🔒")
            })
        })
    }
    else if (reaction.emoji.name === "🔒") {
        if (message.channel.name.endsWith("-ticket")) {
            message.channel.delete()
        }
        else {
            return;
        }
    }
})

client.login(token)
