const Discord = require('discord.js');

module.exports = {
    name: "ping",
    execute(message) {
        message.channel.send("Patiente...")

        .then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp

            message.channel.bulkDelete(1);

            const embed = new Discord.MessageEmbed()
            .setColor("#2F3136")
            .setTitle("Latence")
            .setDescription(`Pong !\n${ping} ms`)
            .setTimestamp()
            .setFooter(`${message.author.tag}, voilà ce que vous avez demander.`);

            message.channel.send(embed);
        })
    }
}
