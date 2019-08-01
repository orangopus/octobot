command = {
  name: "about",
  description: "about",
  protocol: function(bot, msg, args, options){
     /*guildMembers = "There are currently **"+msg.channel.guild.memberCount+" members** on this guild.";
     msgDate = new Date(msg.channel.guild.createdAt);
     guildAvatar = "https://discordapp.com/api/guilds/"+msg.channel.guild.id+"/icons/"+msg.channel.guild.icon+".jpg";*/  
     return bot.createMessage(msg.channel.id, {
            embed: {
                content: "[]()",
                description:
                "**Version: **" + options.botVersion
                + "\n You can get help on the server by typing `"+options.prefix+"help`",
                author: { // Author property
                    name: "Octobot",
                    icon_url: "https://cdn.discordapp.com/avatars/"+bot.user.id+"/"+bot.user.avatar+".jpg"
                },
                color: 16748861, // Color, either in hex (show), or a base-10 integer
                fields: [ // Array of field objects
                    {
                        name: "**Currently connected to**", // Field title
                        value: bot.guilds.map(guild => guild.name).length+" server(s)",
                        inline: true
                    },
                    {
                        name: "**Current server:**",
                        value: "`"+msg.channel.guild.name+"`",
                        inline: true
                    },
                    {
                        name: "**Global prefix**",
                        value: "`"+options.prefix+"`",
                        inline: true
                    },
                    {
                        name: "**Current game:**",
                        value: "`"+options.gameName+"`",
                        inline: true
                    }, 
                    {
                        name: "**Members:**",
                        value: "There are **"+msg.channel.guild.memberCount+" members** on this guild.",
                        inline: true
                    }
                ],
                footer: { // Footer text
                    text: "Coded with 🧡 by the Orangopus community.",
                    icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
                }
            }
        });
    }
}

module.exports = command;