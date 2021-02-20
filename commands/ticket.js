const Discord = require("discord.js");

module.exports = {
    name: "ticket",
    execute(message) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (!message.guild.channels.cache.find(ch => ch.name === "tickets")) {
                message.guild.channels.create("tickets", {
                    permissionOverwrites: [
                        {
                            deny: "SEND_MESSAGES",
                            id: message.guild.id
                        }
                    ]
                })
                .then(ch => {
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Tickets Panel")
                    .setColor("#2F3136")
                    .setDescription("Pour ouvrir un ticket merci d'utiliser la réaction ci dessous.")

                    ch.send(embed)
                    .then(msg => {
                        msg.react("🎟️")
                    })
                })
            }
            else {
                message.reply("Un channel avec le panel des tickets existe déjà.")
            }
        }
        else {
            message.reply("Tu n'as pas la permission `ADMINISTRATOR`")
        }
    }
}