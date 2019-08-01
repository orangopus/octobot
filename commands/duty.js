var async = require('async');
var request = require('snekfetch');
var webhooks = require('../hooks.json'); 
var _dutyHook = webhooks.agendaurl;

command = {
  name: "duty",
  description: "Changes available/unavailable duty.",
  protocol: function(bot, msg, args, options, webhooks){
    if (msg.member && msg.channel.guild.id == "81812480254291968") {
    var memberAvatar = "https://cdn.discordapp.com/avatars/"+msg.member.user.id+"/"+msg.member.user.avatar+".jpg";
    var reasonVar = args.slice(1).join(" ");
    var n = msg.member.nick
    if(msg.member.nick===null){ n = msg.author.username }
    if(msg.member.roles.includes("250017997194788864")){
      var currentRoles = msg.member.roles;
      if (args[0] === "on"){
        // adds available
       bot.addGuildMemberRole("81812480254291968", msg.author.id, "226843141733351424", "");
       // removes Unavailable
       bot.removeGuildMemberRole("81812480254291968", msg.author.id, "226840328429109248", "");
       //removes idle
       bot.removeGuildMemberRole("81812480254291968", msg.author.id, "251170075141210112", "");
      bot.createMessage(msg.channel.id, ":ok: `Duty status has been changed to available. Remember to clock off, "+n+"!`");
      msg.channel.createMessage("",{},{
      "color": 0x1f9e4a,
      "fields": [{name: "🆗 `Duty status has been changed to available.`", value: "`Remember to clock off, "+n+"!`"}]
      });
      request.post(_dutyHook)
      .send({
      "username": "Duty Monitor",
      "icon_url": memberAvatar,
      "text": "[](invisible)",
      "attachments": [
        {
          "color": "#1f9e4a",
          "pretext": "**"+n+"** `("+msg.author.username+"#"+msg.member.user.discriminator+")` is now on duty!",
          "thumb_url": memberAvatar,
          "fields": [
            {
              "title": "**Note:** ",
              "value": reasonVar == "" ? "`No note attached.`" : reasonVar,
              "short": false
            }
        ],
          "footer": "Timestamp ",
          "ts": new Date().getTime() / 1000
        }
      ]
      })
      .end((err, res)=>{
      });
      }
      if (args[0] === "idle"){
        // removes available
       bot.removeGuildMemberRole("81812480254291968", msg.author.id, "226843141733351424", "");
       // removes Unavailable
       bot.removeGuildMemberRole("81812480254291968", msg.author.id, "226840328429109248", "");
       //adds idle
       bot.addGuildMemberRole("81812480254291968", msg.author.id, "251170075141210112", "");
      bot.createMessage(msg.channel.id, ":ok: `Duty status has been changed to idle. Remember to clock off, "+n+"!`");
      msg.channel.createMessage("",{},{
      "color": 0x1f9e4a,
      "fields": [{name: "🆗 `Duty status has been changed to idle.`", value: "`Remember to clock off, "+n+"!`"}]
      });
      request.post(_dutyHook)
      .send({
      "username": "Duty Monitor",
      "icon_url": memberAvatar,
      "text": "[](invisible)",
      "attachments": [
        {
          "color": "#FFA500",
          "pretext": "**"+n+"** `("+msg.author.username+"#"+msg.member.user.discriminator+")` is now idle!",
          "thumb_url": memberAvatar,
          "fields": [
            {
              "title": "**Note:** ",
              "value": reasonVar == "" ? "`No note attached.`" : reasonVar,
              "short": false
            }
        ],
          "footer": "Timestamp ",
          "ts": new Date().getTime() / 1000
        }
      ]
      })
      .end((err, res)=>{
      });
      }
     if (args[0] === "off"){
      // adds Unavailable
      bot.addGuildMemberRole("81812480254291968", msg.author.id, "226840328429109248", "");
      // removes available
      bot.removeGuildMemberRole("81812480254291968", msg.author.id, "226843141733351424", "");
      //removes idle
      bot.removeGuildMemberRole("81812480254291968", msg.author.id, "251170075141210112", "");
      bot.createMessage(msg.channel.id, ":ok: `Remember to clock on when you return, "+n+"!`");
      msg.channel.createMessage("",{},{
      "color": 0xf33838,
      "fields": [{name: "🆗 `Duty status has been changed to unavailable.`", value: "`Remember to clock on when you return, "+n+"!`"}]
      });
      request.post(_dutyHook)
      .send({
      "username": "Duty Monitor",
      "icon_url": memberAvatar,
      "text": "[](invisible)",
      "attachments": [
        {
          "color": "#f33838",
          "pretext": "**"+n+"** `("+msg.author.username+"#"+msg.member.user.discriminator+")` is no longer on duty!",
          "thumb_url": memberAvatar,
          "fields": [
            {
              "title": "**Reason:** ",
              "value": reasonVar == "" ? "`unspecified`" : reasonVar,
              "short": false
            }
        ],
          "footer": "Timestamp ",
          "ts": new Date().getTime() / 1000
        }
      ]
      })
      .end((err, res)=>{
      });
      }
    }
    if (args < 1){
        var avresult = "";
        var unresult = "";
        var idleresult = "";
        var membersAvailable = msg.channel.guild.members.filter(m => ~m.roles.indexOf("226843141733351424"));
        var avCount = msg.channel.guild.members.filter(m => ~m.roles.indexOf("226843141733351424")).length;
        var membersUnavailable = msg.channel.guild.members.filter(m => ~m.roles.indexOf("226840328429109248"));
        var unCount = msg.channel.guild.members.filter(m => ~m.roles.indexOf("226840328429109248")).length;
        var membersIdle = msg.channel.guild.members.filter(m => ~m.roles.indexOf("251170075141210112"));
        var idleCount = msg.channel.guild.members.filter(m => ~m.roles.indexOf("251170075141210112")).length;
        async.each(membersAvailable, (item, cb) => {
        avresult += `🎓 **${item.user.username}**#${item.user.discriminator} - \`.id ${item.user.id}\`\n`
        cb()
        }, () => {
        bot.createMessage(msg.channel.id,
          "**__<:online:443611732418494484> TEAM MEMBERS ON DUTY__ ("+avCount+")** `⭐ Pro-Tip: Only ping staff if you absolutely need assistance.`\n"+avresult);
        });
        async.each(membersIdle, (item, cb) => {
        idleresult += `🎓 **${item.user.username}**#${item.user.discriminator} - \`.id ${item.user.id}\`\n`
       cb()
        }, () => {
        bot.createMessage(msg.channel.id,
         "**__<:idle:443611732867284992> TEAM MEMBERS IDLE__ ("+idleCount+")** `⭐ Pro-Tip: Only ping them if their agenda says that you can.`\n"+idleresult);
        });
        async.each(membersUnavailable, (item, cb) => {
        unresult += `🎓 **${item.user.username}**#${item.user.discriminator} - \`.id ${item.user.id}\`\n`
        cb()
        }, () => {
        bot.createMessage(msg.channel.id,
          "**__<:offline:443611732557168651> TEAM MEMBERS OFF DUTY__ ("+unCount+")** `⭐ Pro-Tip: Do not ping staff who are off-duty.`\n"+unresult);
        });
      }
    }
  }
}
module.exports = command;

