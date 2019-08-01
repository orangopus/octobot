command = {
  name: "optout",
  description: "Removes specific activity zones.",
  protocol: function(bot, msg, args, options){
      if (args[0] === "diy"){
      bot.removeGuildMemberRole("81812480254291968", msg.author.id, "443589359715745813", "Member has been removed from DIY.");
      bot.createMessage(msg.channel.id, ":ok: `You no longer have access to Cheese.lab DIY.`");
      }
      else if (args[0] === "gaming"){
      bot.removeGuildMemberRole("81812480254291968", msg.author.id, "443590269242441738", "Member has been removed from GAMING.");
       bot.createMessage(msg.channel.id, ":ok: `You have no longer have access to Cheese.lab Gaming.`");
      }
      else if (args[0] === "notifications"){
        bot.removeGuildMemberRole("81812480254291968", msg.author.id, "449366980177166346", "Member is no longer receiving notifications.");
         bot.createMessage(msg.channel.id, ":ok: `You will no longer receive notifications.`");
      }
      else {
        bot.createMessage(msg.channel.id, "`.optout [diy|gaming|notifications]`");
      }
    }
  }
module.exports = command;
