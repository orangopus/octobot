function text2Binary(textChange) {
  return textChange.split('').map(function (char) {
      return char.charCodeAt(0).toString(2);
  }).join(' ');
}

command = {
  name: "ttb",
  description: "text to binary",
  protocol: function(bot, msg, args, options){
    var textChange = msg.content.slice(1+"ttb".length);
    bot.createMessage(msg.channel.id, "**:abcd: :arrow_forward: :zero: :one: Result:**"+ "```rb\n"+text2Binary(textChange)+"```");
  }
}

module.exports = command;
