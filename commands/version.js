command = {
  name: "version",
  description: "version",
  protocol: function(bot, msg, args, options){
    return "**Bot Version: **" + options.botVersion;
  }
}

module.exports = command;
