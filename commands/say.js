command = {
  name: "say",
  description: "say",
  protocol: function(bot, msg, args, options){
    var say = msg.content.slice(1 + "say".length);
    bot.createMessage(msg.channel.id, say);
  }
}

module.exports = command;
