const Discord = require("discord.js");

module.exports = {
    name: "userinfos",
    execute(message) {
        const m = message.mentions.members.first()

        if (m) {
            const e = new Discord.MessageEmbed()
            .setTitle("Infos d'un utilisateur")
            .setThumbnail(m.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Nom", value: m.user.username },
                { name: "ID", value: m.user.id },
                { name: "Discriminateur", value: m.user.discriminator },
                { name: "Compte créé le", value: m.user.createdAt },
                { name: "Nom dans le serveur", value: m.nickname }
            )

            message.channel.send(e)
        }
        else {
            const e = new Discord.MessageEmbed()
            .setTitle("Infos d'un utilisateur")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Nom", value: message.author.username },
                { name: "ID", value: message.author.id },
                { name: "Discriminateur", value: message.author.discriminator },
                { name: "Compte créé le", value: message.author.createdAt },
                { name: "Nom dans le serveur", value: message.author.nickname }
            )

            message.channel.send(e)
        }
    }
}