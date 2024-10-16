const command = {
  name: "optin",
  description: "Acess specific activity zones.",
  execute: function(bot, msg, args, options){
      if (args[0] === "diy"){
      bot.addGuildMemberRole("81812480254291968", msg.author.id, "443589359715745813", "Member has been added to DIY.");
      bot.createMessage(msg.channel.id, ":ok: `You now have access to Cheese.lab DIY.`");
      }
      else if (args[0] === "gaming"){
      bot.addGuildMemberRole("81812480254291968", msg.author.id, "443590269242441738", "Member has been added to GAMING.");
       bot.createMessage(msg.channel.id, ":ok: `You now have access to Cheese.lab Gaming.`");
      }
      else if (args[0] === "notifications"){
        bot.addGuildMemberRole("81812480254291968", msg.author.id, "449366980177166346", "Member is now receiving notifications.");
         bot.createMessage(msg.channel.id, ":ok: `You will now receive notifications.`");
      }
      else {
        bot.createMessage(msg.channel.id, "`.optin [diy|gaming|notifications]`");
      }
    }
  }
export default command;