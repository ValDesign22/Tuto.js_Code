const Discord = require("discord.js");

module.exports = {
    name: "serverinfos",
    execute(message) {
        const e = new Discord.MessageEmbed()
        .setTitle("Informations du Serveur")
        .setThumbnail(message.guild.iconURL())
        .setColor("RANDOM")
        .addFields(
            { name: "Propriétaire", value: message.guild.owner.user.tag },
            { name: "ID du Propriétaire", value: message.guild.owner.id },
            { name: "Nom du serveur", value: message.guild.name },
            { name: "ID du serveur", value: message.guild.id },
            { name: "Niveau de vérification", value: message.guild.verificationLevel },
            { name: "Région du serveur", value: message.guild.region },
            { name: "Date de création du serveur", value: message.guild.createdAt },
            { name: "Membres", value: message.guild.memberCount },
            { name: "Channels", value: message.guild.channels.cache.size },
            { name: "Roles", value: message.guild.roles.cache.size },
            { name: "Emojis", value: message.guild.emojis.cache.size }
        )

        message.channel.send(e)
    }
}