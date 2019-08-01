var needle = require('needle');
var admin = require('firebase-admin');

var serviceAccount = require('./../cheeselab-creds.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cheeselab-7a34e.firebaseio.com'
});

command = {
  name: "search",
  description: "Look for resources in the Cheese.lab API",
  protocol: function(bot, msg, args, options){

    /*let db = admin.database().ref("/resources");

    let searchWord = args.join(" ").toLowerCase();*/
    
    function sortMe(oldObj, keyword) {
      let newObj = oldObj.filter(obj => {
        if(obj.name.toLowerCase().includes(keyword.toLowerCase())) {
          return true;
        }
        return false;
      });
      return newObj;
    }
   needle.get(`../resources.json`, (err, response, body) => {
    if (!err && response.statusCode == 200) {

    let searchWord = args.join(" ").toLowerCase();
    let sorted = sortMe(response.body, searchWord);
    
    if (!sorted.length) {
    return bot.createMessage(msg.channel.id, "⛔ `\""+args+"\" doesn't exist and returned no results...`");
    };
    if (sorted.length > 15) {
    return bot.createMessage(msg.channel.id, "⛔ `Too many results to display. Please be more specific.`");
    };
    var results = `**__Showing ${sorted.length} result(s) :mag_right:__**\n\n`;
    for (var result of sorted) {
      var resdes = "";
       if(result.description!=undefined || result.description!=null){ resdes = result.description+"\n" }
      results += "**"+result.name+"** `"+result.type+"` | <"+result.link+"> \n"
      +resdes;
    }
    bot.createMessage(msg.channel.id, results);
    } else {
    console.log("The cheeses are now sad.. An error occured");
    }
    });
  }
}

module.exports = command;
