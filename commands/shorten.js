const fetch = require('snekfetch');
const util = require("util");
var request = require("request");

command = {
  name: "shorten",
  description: "Shorten a URL using our custom Rebrandly shortlink.",
  protocol: function (bot, msg, args, options) {
    if (msg.member.roles.includes("250017997194788864")) {
      var urlHere = args.slice(0).join(" ");
      var slashHere = args.slice(1).join(" ");
      if (args < 1) {
        bot.createMessage(msg.channel.id, {
          embed: {
            content: "[]()",
            description: "`.shorten <https://link.here/>`",
            author: { // Author property
              name: "Link Shortener (Usage)",
              icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
            },
            color: 16748861
          }
        })
      } else if (args.length = 1) {
        console.log(urlHere +" | "+ slashHere)
        request({
          uri: "https://api.rebrandly.com/v1/links",
          method: "POST",
          body: JSON.stringify({
            destination: urlHere,
            domain: {
              fullName: "lab.pw"
            },
            slashtag: slashHere
          }),
          headers: {
            "Content-Type": "application/json",
            "apikey": "1464dc80cf6f4808aed4dca67e325782"
          }
        }, function (err, response, body) {
          var link = JSON.parse(body);
          if (link.destination != undefined) {
            bot.createMessage(msg.channel.id, {
              embed: {
                content: "[]()",
                description: "**Long URL was:**\n```" + link.destination + "```\n\n**Short URL generated:**\nhttps://lab.pw/" + link.slashtag,
                author: { // Author property
                  name: "Link Shortener",
                  icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
                },
                color: 16748861
              }
            })
          } else if (link.destination === undefined){
            bot.createMessage(msg.channel.id, {
              embed: {
                content: "[]()",
                description: "**Wasn't able to generate a link.\n\nPlease use these parameters:** \n`.shorten <https://link.here/>`",
                author: { // Author property
                  name: "Link Shortener",
                  icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
                },
                color: 0xf33838
              }
            })
          }
        })
      }
    }
  }
}

module.exports = command;