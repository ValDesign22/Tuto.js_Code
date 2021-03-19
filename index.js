const { token, prefix, guildSupport } = require("./config.json");

const Discord = require("discord.js");
const fs = require("fs");
const leveling = require("discord-leveling");
const canvacord = require("canvacord");

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

client.on("message", async message => {
    if (message.author.bot) {
        return;
    }

    if (message.channel.type === "dm") {
        const msg = message.content;

        const guild = client.guilds.cache.find(g => g.id === `${guildSupport}`);

        let categorie = guild.channels.cache.find(c => c.name === "Tickets" && c.type === "category");
        if (!categorie) categorie = await guild.channels.create("Tickets", {type: "category", position: 1});

        if (!guild.channels.cache.find(c => c.name === `${message.author.id}-mp`)) {
            guild.channels.create(`${message.author.id}-mp`, {
                permissionOverwrites: [
                    {
                        deny: "VIEW_CHANNEL",
                        id: guild.id
                    },
                ],
                parent: categorie.id,
                topic: `${message.author.id}`,
            })
            .then(ch => {
                const e = new Discord.MessageEmbed()
                .setTitle("Un membre demande de l'aide")
                .setColor("#2F3136")
                .setDescription(`Utilisateur: ${message.author.tag}\nID: ${message.author.id}`)
                .setFooter("Merci de cliquer sur 🔒 pour fermer le ticket")
                .addField("Sa question", msg)

                ch.send(e)
                .then(msg => {
                    msg.react("🔒")
                })
            })
        }
        else {
            const channelTicket = guild.channels.cache.find(c => c.name === `${message.author.id}-mp`)

            const e = new Discord.MessageEmbed()
            .setTitle("Une nouvelle question")
            .setColor("#2F3136")
            .addField("Sa question", msg)

            channelTicket.send(e)
        }
    }
    else {
        if (message.channel.name.endsWith("-mp")) {
            const msg = message.content;

            message.delete();

            const e1 = new Discord.MessageEmbed()
            .setTitle(message.author.tag)
            .setColor("#2F3136")
            .setDescription(msg)

            message.channel.send(e1)

            const user = await client.users.fetch(`${message.channel.topic}`);

            const e2 = new Discord.MessageEmbed()
            .setTitle("Réponse du staff")
            .setColor("#2F3136")
            .addField(message.author.tag, msg)

            await user.send(e2)
            .then(msg => {
                msg.react("📥")
            })
        }
        else {
            var profil = await leveling.Fetch(message.author.id);
            leveling.AddXp(message.author.id, 10);

            if (profil.xp + 10 > 90) {
                leveling.AddLevel(message.author.id, 1);
                leveling.SetXp(message.author.id, 0);
                
                var output = await leveling.Fetch(message.author.id)

                const rankCard = new canvacord.Rank()
                .setAvatar(message.author.displayAvatarURL({format: "png"}))
                .setCurrentXP(output.xp)
                .setRequiredXP(100)
                .setDiscriminator(message.author.discriminator)
                .setUsername(message.author.username)
                .setProgressBar("#96c42e", "COLOR")
                .setLevel(output.level)
                .setStatus(message.author.presence.status)

                rankCard.build()
                .then(data => {
                    const attachment = new Discord.MessageAttachment(data, "levelUp.png");

                    message.channel.send(attachment)
                })
            }

            if (!message.content.startsWith(prefix)) return;

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
        }
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
        if (message.channel.name.endsWith("-ticket") || message.channel.name.endsWith("-mp")) {
            message.channel.delete()
        }
        else {
            return;
        }
    }
})

client.login(token)
