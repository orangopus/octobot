command = {
  name: "emotes",
  description: "Displays all emotes",
  protocol: function(bot, msg, args, options){ 
    return "**Current Custom Emotes:** ";
  }
}

module.exports = command;
