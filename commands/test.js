var request = require('snekfetch');

command = {
  name: "test",
  description: "Testing hooks",
  protocol: function(bot, msg, args, options){
    if (msg.member && msg.channel.guild.id == "81812480254291968") {
    var memberAvatar = "https://cdn.discordapp.com/avatars/"+msg.member.user.id+"/"+msg.member.user.avatar+".jpg";
    var n = msg.member.nick
    if(msg.member.nick===null){ n = msg.member.user.username }
     return msg.channel.id, {
            embed: {
                title: n, // Title of the embed
                description: "Do not test me, " + msg.author.username+"!",
                author: { // Author property
                    name: msg.author.username,
                    icon_url: msg.author.avatarURL
                },
                color: 0x008000, // Color, either in hex (show), or a base-10 integer
                fields: [ // Array of field objects
                    {
                        name: "Some extra info.", // Field title
                        value: "Some extra value.", // Field
                        inline: true // Whether you want multiple fields in same line
                    },
                    {
                        name: "Some more extra info.",
                        value: "Another extra value.",
                        inline: true
                    }
                ]
            }
        }
  }
 }
}

module.exports = command;
