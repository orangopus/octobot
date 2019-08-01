command = {
  name: "ping",
  description: "ping",
  protocol: function(bot, msg, args, options){
   var date = new Date().getTime();

bot.createMessage(msg.channel.id, "`loading`")
.then(function(msg) {
  var end = new Date().getTime() - date;
  bot.editMessage(msg.channel.id, msg.id, " :ping_pong: "+ " `"+end+"ms`");
});    
  }
}

module.exports = command;
