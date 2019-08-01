command = {
  name: "server",
  description: "server",
  protocol: function(bot, msg, args, options){
    var msgDate = new Date(msg.channel.guild.createdAt);
    return "__**"+msg.channel.guild.name.toUpperCase() + "'S SERVER INFO:**__" + "\n"
    + "```ruby\n"
    +"\n"+"           ID: "+msg.channel.guild.id
    +"\n"+"         Name: "+msg.channel.guild.name
    +"\n"+"       Region: "+msg.channel.guild.region.toUpperCase()
    +"\n"+"      Members: "+msg.channel.guild.memberCount
    +"\n"+"Text Channels: "+msg.channel.guild.channels.size
    +"\n"+"  AFK Timeout: "+msg.channel.guild.afkTimeout + " seconds"
    +"\n"+"      Created: "+msgDate
    +"\n"+"       Avatar: https://discordapp.com/api/guilds/"+msg.channel.guild.id+"/icons/"+msg.channel.guild.icon+".jpg "
    + "```";
  }
}

module.exports = command;
