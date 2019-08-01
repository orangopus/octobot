function getUptimeString(bot) {
    var d = new Date(bot.uptime);
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var x = ":timer: **Current bot uptime since last code update:** \n```xl"+ "\n"+ h + " hours, " + m + " minutes & " + s +" seconds.```";
    return x;
}

command = {
  name: "uptime",
  description: "uptime",
  protocol: function(bot, msg, args, options){
    return getUptimeString(bot);
  }
}

module.exports = command;
