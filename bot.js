const Eris = require("eris");
const image = require('imagemagick');
var fs = require('fs');

var packBuild = require('./package.json');

var _VERSION = "v"+packBuild.version;

//DEBUGGING
var _DEBUG = packBuild.debug; // boolean
var debugCheck = _DEBUG;

// OPTIONS

var ownerID = "71323348545576960";

var options = {
    botVersion: _VERSION,
    gameName: "orangop.us",
    prefix: ".",
    owner: ownerID
}

// DEBUG CHECK

if (debugCheck === true) {
    options.gameName = "debug-mode" + " | " + _VERSION;
    console.log("Debugging is turned on");
}else if (debugCheck === false){
    options.gameName;
    console.log("Debugging is turned off");
}else {};

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

var chandle = require("./commandhandler.js");

// STORE YOUR TOKEN IN token.json
var token = require('./token.json');  
// CODE FOR TOKEN
var _TOKEN = token.token
// TELLS ERIS TO USE THAT TOKEN
var bot = new Eris("Bot "+ _TOKEN);

/* STARTS THE BOT AND LOGS THOSE MESSAGES, 
YOU CAN CUSTOMISE THIS IF YOU WANT*/
bot.on("ready", () => {
    console.log("Octobot is booting up...");
    console.log("Extracting dank memes...");
    console.log("Done!");
    console.log("Running Bot Version: " + options.botVersion);
    bot.editStatus(true,{
        name: options.gameName
    });
    console.log("Game set to " + options.gameName);
});

bot.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    chandle.exec(msg, bot, options);
});

bot.connect();
