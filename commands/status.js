const fetch = require('snekfetch');
var statusy = require('../statusy.json');
const util = require("util");
var _APITOKEN = statusy.token
var _ID = statusy.id

command = {
  name: "status",
  description: "Add, view, delete, & resolve Statusy incidents.",
  protocol: function (bot, msg, args, options, statusy) {
    var regex1 = new RegExp('^\\d+$');
    if(args.length == 2 && args[0].toLowerCase() === "incidents" && regex1.test(args[1]) === true) {
      console.log("No error");
      fetch.get("https://app.statusy.co/api/v1/" + _APITOKEN + "/statuspage/" + _ID + "/incident/all")
      .then(r => {
          let data = r.body.incidents.find((x) => {
            return parseInt(x.id) === parseInt(args[1]);
          });

          bot.createMessage(msg.channel.id, {
            embed: {
              content: "[]()",
              description: data.description,
              author: { // Author property
                name: "Incident ("+data.id+") - "+data.title,
                icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
              },
              fields: [
                {
                  name: "**Status:**", // Field title
                  value: data.status,
                  inline: true
                },
                {
                  name: "**Service affected:**", // Field title
                  value: data.service_description,
                  inline: true
                },
                {
                  name: "**Incident URL**",
                  value: "**[View Incident]("+data.url+")**", // Field title
                  inline: true
                },
                {
                  name: "**Created at:**", // Field title
                  value: data.created_date,
                  inline: true
                },
                {
                  name: "**Resolved at:**", // Field title
                  value: data.solved_date,
                  inline: true
                }
              ],
              color: 16748861
            }
          })
      });
    } else {
      //must have two arguments
      console.log("Invalid arguments");
    }
  }
}

module.exports = command;