const command = {
  name: "say",
  description: "say",
  execute: function(bot, msg, args, options){
    var say = msg.content.slice(1 + "say".length);
    bot.createMessage(msg.channel.id, say);
  }
}

export default command;