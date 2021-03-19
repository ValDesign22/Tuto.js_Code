const Discord = require("discord.js");
const leveling = require("discord-leveling");
const canvacord = require("canvacord");

module.exports = {
    name: "rank",
    async execute(message) {
        const user = message.mentions.users.first() || message.author;

        var output = await leveling.Fetch(user.id)

        const rankCard = new canvacord.Rank()
        .setAvatar(user.displayAvatarURL({format: "png"}))
        .setCurrentXP(output.xp)
        .setRequiredXP(100)
        .setDiscriminator(user.discriminator)
        .setUsername(user.username)
        .setProgressBar("#96c42e", "COLOR")
        .setLevel(output.level)
        .setStatus(user.presence.status)

        rankCard.build()
        .then(data => {
            const attachment = new Discord.MessageAttachment(data, "rankCard.png");

            message.channel.send(attachment)
        })
    }
}