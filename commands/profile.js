const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'profile',
    description: 'Check account profile.',
    cooldown: 10,
    execute(message, args, client) {
		MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            dbInstance = db.db(currentdb);
            let userID;
            let user = null;
            if (args.length) {
                if (args[0] == "me") {
                    mentionedUser = message.author;
                } else {
                    mentionedUser = message.mentions.users.first();
                }
            } else {
                mentionedUser = message.author;
            }
            user = await dbInstance.collection("users").findOne({ id: mentionedUser.id });
            db.close();
            if (user != null) {
                const balance = user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                const lastWin = user.lastWin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                const totalCredits = user.totalCredits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                const slotsPlays = user.slotsPlays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                const profileEmbed = new Discord.MessageEmbed()
                    .setAuthor(mentionedUser.tag,mentionedUser.avatarURL())
                    .setColor(user.color)
                    .addField("Balance:",balance,true)
                    .addField("Total Earnings:",totalCredits,true)
                    .addField("Slots plays:",slotsPlays,true)
                    .addField("Last win:", lastWin,true)
                    message.channel.send(profileEmbed)
            } else {
                message.reply("that user does not have an account.")
            }
        });


    },
};