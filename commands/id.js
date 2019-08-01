var request = require('snekfetch');

command = {
  name: "id",
  description: "id",
  protocol: function(bot, msg, args, options){
    if(args[0] === "beta"){
      var memberName = "ID: "+msg.member.user.username;
      var memberAvatar = "https://cdn.discordapp.com/avatars/"+msg.member.user.id+"/"+msg.member.user.avatar+".jpg";
      var msgMemberDate = new Date(msg.member.user.createdAt);
      var memberContent = "**Created:** "+msgMemberDate;
      try {
        embed = {
          "username": memberName,
          "text": memberContent,
          "icon_url": memberAvatar
        }
      } catch (err) {
        return;
      } 
    }
    var member = msg.channel.guild.members.find((o) => {
    if (o.user.username === args.join(" ") || o.user.id === args.join(" ") || o.user.mention === args.join(" ") || "<@!"+o.user.id+">" === args.join(" ")) return true
    });
    if (args[0] === "me") {
    member = msg.member;
    }
    if (args < 1) {
    member = msg.member;
    }
    var msgDate = new Date(member.joinedAt);
    var msgCreated = new Date(member.user.createdAt);
    var msgGame;
    try {msgGame = "Playing "+member.game.name;}
    catch(err) {msgGame = "N/A";}
    var id = msg.content.slice(1 + "id".length);
    var n = ''
    if(member.nick!=null){ n = "\n"+"     Nickname: "+member.nick } // Cool look
    var ro = []
    ro = member.roles.map(r => msg.channel.guild.roles.find(m => m.id == r).name)
    return "__**"+member.user.username.toUpperCase() + "'S OFFICIAL ID CARD - ACCESS CODE: #"+member.user.discriminator+"**__" + "\n"
    + "```ruby\n"
    +"\n"+"           ID: "+member.user.id
    +"\n"+"         Name: "+member.user.username
    +n
    +"\n"+"Discriminator: "+member.user.discriminator
    +"\n"+"       Status: "+member.status
    +"\n"+" Current Game: "+msgGame
    +"\n"+"          Bot: "+member.user.bot
    +"\n"+"        Roles: "+ro
    +"\n"+"       Joined: "+msg.channel.guild.name+" on "+msgDate
    +"\n"+"      Created: "+msgCreated
    +"\n"+"       Avatar: https://cdn.discordapp.com/avatars/"+member.user.id+"/"+member.user.avatar+".jpg "
    + "```";
  }
}

module.exports = command;
