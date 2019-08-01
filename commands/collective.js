const fetch = require('snekfetch');
const util = require("util");

command = {
  name: "collective",
  description: "Get budget information, collective name, and more.",
  protocol: function (bot, msg, args, options, statusy) {
    if(args < 1) {
      console.log("No error");
      fetch.get("https://opencollective.com/orangopus.json")
      .then(r => {
          let data = r.body

          let orgBalance = "£" + parseFloat(Math.round(data.balance * 100) / 10000).toFixed(2)
          let orgBudget = "£" + parseFloat(Math.round(data.yearlyIncome * 100) / 10000).toFixed(2)


          bot.createMessage(msg.channel.id, {
            embed: {
              content: "[]()",
              description: "You can view the collective by [clicking here](https://opencollective.com/"+data.slug+")\n\n",
              author: { // Author property
                name: "Orangopus' Collective",
                icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
              },
              fields: [
                {
                  name: "**Current Balance 🏧**",
                  value: orgBalance,
                  inline: true
                },
                {
                  name: "**Est. Annual Budget 📅**", 
                  value: orgBudget,
                  inline: true
                },
                {
                  name: "**Total Contributors 💡**",
                  value: data.contributorsCount,
                  inline: true
                },
                {
                  name: "**Total Backers 💰**",
                  value: data.backersCount,
                  inline: true
                }
              ],
              footer: { // Footer text
                text: "Powered by OpenCollective",
                icon_url: "https://images.opencollective.com/opencollectiveinc/019a512/logo.png"
              },
              color: 16748861
            }
          })
      });
    } else if (args[0] === "members"){
      fetch.get("https://opencollective.com/orangopus/members.json")
      .then( r => {
       let backers = r.body

       bot.createMessage(msg.channel.id, {
        embed: {
          content: "[]()",
          description: "**RECENT MEMBERS:**\n\n"
          + "**Name:** " + "["+ backers[0].name + "](" + backers[0].profile + ")\n**Role:** " + backers[0].role + "\n**Total Amount Donated: ** $" + backers[0].totalAmountDonated + "\n\n"
          + "**Name:** " + "["+ backers[1].name + "](" + backers[1].profile + ")\n**Role:** " + backers[1].role + "\n**Total Amount Donated: ** $" + backers[1].totalAmountDonated + "\n\n"
          + "**Name:** " + "["+ backers[2].name + "](" + backers[2].profile + ")\n**Role:** " + backers[2].role + "\n**Total Amount Donated: ** $" + backers[2].totalAmountDonated + "\n\n"
          + "**Name:** " + "["+ backers[3].name + "](" + backers[3].profile + ")\n**Role:** " + backers[3].role + "\n**Total Amount Donated: ** $" + backers[3].totalAmountDonated + "\n\n"
          + "**Name:** " + "["+ backers[4].name + "](" + backers[4].profile + ")\n**Role:** " + backers[4].role + "\n**Total Amount Donated: ** $" + backers[4].totalAmountDonated,
          author: { // Author property
            name: "Orangopus' Collective",
            icon_url: "https://cdn.discordapp.com/icons/544532292329144322/e6ea9363d5466fa5a8661e1886107eb0.png"
          },
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