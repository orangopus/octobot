command = {
  name: "students",
  description: "students",
  protocol: function(bot, msg, args, options){
    var enrolled = msg.channel.guild.members.filter(m => ~m.roles.indexOf("220875088600367105")).length;
    var projects = msg.channel.guild.members.filter(m => ~m.roles.indexOf("220874108353773568")).length;
    var guildCount = msg.channel.guild.memberCount;
    var unenrolled = guildCount - enrolled;
    var result = enrolled / (enrolled + unenrolled) * 100;
    var resultFix = result.toFixed(2);
    bot.createMessage(msg.channel.id,
      "**Total Members in "+msg.channel.guild.name+": **"+guildCount
      +"\n **Enrolled Students: **"+enrolled
      +"\n **Unenrolled Visitors: **"+unenrolled
      +"\n **Bot Projects: **"+projects
      +"\n **"+resultFix+"%** of **"+msg.channel.guild.name+"** have enrolled."
      );
  }
}

module.exports = command;
