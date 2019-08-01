var async = require('async');
var request = require('snekfetch');
var webhooks = require('../hooks.json'); 
var _newsHook = webhooks.newsurl;

command = {
  name: "news",
  description: "Add news to the news feed.",
  protocol: function(bot, msg, args, options, webhooks){
    if (msg.member && msg.channel.guild.id == "544532292329144322") {
    var memberAvatar = "https://cdn.discordapp.com/avatars/"+msg.member.user.id+"/"+msg.member.user.avatar+".jpg";
    var n = msg.member.nick
    if(msg.member.nick===null){ n = msg.member.user.username }
    if(msg.member.permission.has("kickMembers")){
      request.post(_newsHook)
      .send({
      "content": "[]()",
      "username": "News Bulletin",
      "icon_url": "",
      "text": "[]()",
      "attachments": [
        {
          "pretext": args.join(" "),
          "color": "#FF913D",
          "footer_icon": memberAvatar,
          "footer":"Posted by "+n+" ",
          "ts": new Date().getTime() / 1000
        }
      ]
      })
      .end((err, res)=>{
      });
      }
    }
  }
}

module.exports = command;
