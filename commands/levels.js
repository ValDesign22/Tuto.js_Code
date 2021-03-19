const Discord = require("discord.js");
const leveling = require("discord-leveling");
const canvacord = require("canvacord");

module.exports = {
    name: "levels",
    async execute(message, args, client) {
        leveling.Leaderboard({
            limit: 3
        })
        .then(async users => {
            if (users[0]) var premier = await client.users.fetch(users[0].userid)
            if (users[1]) var deuxieme = await client.users.fetch(users[1].userid)
            if (users[2]) var troisieme = await client.users.fetch(users[2].userid)

            const e = new Discord.MessageEmbed()
            .setTitle("Le leaderboard des personne ayant le plus haut niveau.")
            .addField("1er", `${premier && premier.tag || "Personne"} : ${users[0] && users[0].level || "Aucun niveau"} : ${users[0] && users[0].xp || "Aucun xp"}`)
            .addField("2eme", `${deuxieme && deuxieme.tag || "Personne"} : ${users[1] && users[1].level || "Aucun niveau"} : ${users[1] && users[1].xp || "Aucun xp"}`)
            .addField("3eme", `${troisieme && troisieme.tag || "Personne"} : ${users[2] && users[2].level || "Aucun niveau"} : ${users[2] && users[2].xp || "Aucun xp"}`)

            message.channel.send(e)
        })
    }
}