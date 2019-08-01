var request = require('snekfetch');

command = {
  name: "guild",
  description: "Shows guild information via Webhooks",
  protocol: function(bot, msg, args, options){
    var guildMembers = "There are currently **"+msg.channel.guild.memberCount+" members** on this guild.";
    var msgDate = new Date(msg.channel.guild.createdAt);
    var guildAvatar = "https://discordapp.com/api/guilds/"+msg.channel.guild.id+"/icons/"+msg.channel.guild.icon+".jpg";
    request.post('https://canary.discordapp.com/api/webhooks/233828282058014730/2Dcy1QS7ei9otTbhA6YiQBh9lw0m62TIWuKKefyStpXFzLwmF_4PLxXQuH1Hi6TMeEPG/slack')
    .send(
      {
    "username": msg.member.guild.name,
    "icon_url": guildAvatar,
    "text": "[](invisible)",
    "attachments": [
      {
        "color": "#face00",
        "author_name": msg.member.guild.name+" Guild Information",
        "author_icon": guildAvatar,
        "pretext":
        "```fix"
        +"\n"+"       Region: "+msg.channel.guild.region.toUpperCase()
        +"\n"+"      Members: "+msg.channel.guild.memberCount
        +"\n"+"Text Channels: "+msg.channel.guild.channels.size
        +"\n"+"  AFK Timeout: "+msg.channel.guild.afkTimeout + " seconds```",
        "footer": msg.member.guild.name + " | Created on "+ msgDate,
        "footer_icon": guildAvatar,
      }
    ]
}
    )
    .end((err, res)=>{
    });
   }
}

module.exports = command;
