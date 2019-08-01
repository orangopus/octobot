const cleverbot = require("cleverbot.io");
var bot = new cleverbot('mbeID157OjLfXySM','JKZvA1tX8XPwJEdneNtFM5bqUzB5I9Fd');


command = {
  name: "cheese",
  description: "cheese",
  protocol: function(bot, msg, args, options){
    var botResponse = msg.content;
        bot.create(function (err, session) {
            bot.setNick("Continuity");
            bot.ask(botResponse, function (err, response) {
                console.log(response); // Will likely be: "Living in a lonely world"
                bot.createMessage(msg.channel.id, "<:synth:230104718414839808> `" + response + "`");
            });
        });
    }
}

module.exports = command;
