const command = {
  name: "github",
  description: "github",
  execute: function(bot, msg, args, options){
    return "Their GitHub link is <https://github.com/" + args[0] + "/>";
  }
}

export default command;