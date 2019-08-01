command = {
  name: "slap",
  description: "slap",
  protocol: function(bot, msg, args, options){
    return "*slaps "+args[0]+" around a bit with a large trout*";
  }
}

module.exports = command;
