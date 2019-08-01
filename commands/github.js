command = {
  name: "github",
  description: "github",
  protocol: function(bot, msg, args, options){
    return "Their GitHub link is <https://github.com/" + args[0] + "/>";
  }
}

module.exports = command;
