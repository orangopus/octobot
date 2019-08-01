var path = require("path").join(__dirname, "commands");
var loadedCommands = {}
const needle = require("needle");
var async = require("async");

require("fs").readdirSync(path).forEach(function (file) {
    try {
        cfile = require("./commands/" + file);
        loadedCommands[cfile.name] = cfile;
    } catch (e) {
        console.log(`Command File ${file} failed to load: ${e}`)
    }
});

handlerFunction = function (msg, bot, options) {
    var label = msg.content.slice(options.prefix.length).split(" ")[0];
    if (msg.content.startsWith(options.prefix) && loadedCommands[label]) {
        var command = loadedCommands[label];
        var args = msg.content.slice(options.prefix.length + label.length).slice(1).split(" ");
        try {
            var res = command.protocol(bot, msg, args, options);
            if (res) bot.createMessage(msg.channel.id, res);
        } catch (e) {
            bot.createMessage(msg.channel.id,

                "📛 `Command failed to execute. Notify Cheese for errorlog.`"
            ).catch(console.log);
            console.log(e);
        }
    } else if (msg.content.startsWith(options.prefix) && label == 'help') {
        var args = msg.content.slice(options.prefix.length + label.length).slice(1).split(" ");
        if (args[0] == undefined || args[0] == "") {
            cmds = Object.keys(loadedCommands).map(c => " `" + c + "`")
            bot.getDMChannel(msg.author.id).then(chan => {
                bot.createMessage(chan.id, 
                    "__**Available Commands**__\n\n" + cmds + 
                    "\n\nType `" + options.prefix + 
                    "help <commandName>` on **" + 
                    msg.channel.guild.name + "** for more info on that command.").catch(console.log);
                bot.createMessage(msg.channel.id, 
                    ":ok: `" + msg.author.username + ", check your messages!` :ok_hand:"
                );
            });
        } else {
            if (loadedCommands[args[0]]) {
                command = loadedCommands[args[0]];
                usa = options.prefix + command.name
                if (command.usage) {
                    usa = options.prefix + command.name + " " + command.usage
                }
                msg =
                    "__**" + command.name + "**__" +
                    "\n" + command.description +
                    "\n**Usage**: " + usa
                bot.createMessage(msg.channel.id, msg);
            } else {
                bot.createMessage(msg.channel.id,
                    "That command couldn't be found!");
            }
        }
    } else if (msg.content.startsWith(options.prefix) && label == 'eval') {
        if (msg.author.id === options.owner) { // options.owner is changeable via bot.js
            try {
                var code = msg.content.slice(1 + "eval".length);
                var result = eval(code);
                bot.createMessage(msg.channel.id, 
                    {
                        embed: {
                            author: {
                                name: "Eval Input/Output",
                                icon_url: "https://cdn.discordapp.com/avatars/"+bot.user.id+"/"+bot.user.avatar+".jpg"
                            },
                            content: "[]()",
                            description: "**▶ Input:**\n" + "```js\n" + code + "```\n" + "**✅ Result:**\n```js\n" + result + "```",
                            color: 0x1f9e4a
                    }});
            } catch (e) {
                bot.createMessage(msg.channel.id, 
                    {
                        embed: {
                            author: {
                                name: "Eval Error",
                                icon_url: "https://cdn.discordapp.com/avatars/"+bot.user.id+"/"+bot.user.avatar+".jpg"
                            },
                            content: "[]()",
                            description: "```fix\n" + e + "```",
                            color: 0xf33838
                    }});
            }
        }
    } else if (msg.content === "I've agreed to the etiquette" && msg.channel.name === "👋new-inklings") {
        bot.addGuildMemberRole("544532292329144322", msg.author.id, "544534233872465937", "New member is now enrolled.");
        bot.createMessage(msg.channel.id, {
            embed: { 
                author: { // Author property
                    name: "Success! You have become an inkling!",
                    icon_url: "https://cdn.discordapp.com/avatars/"+bot.user.id+"/"+bot.user.avatar+".jpg"
                },
                content: "[]()",
                description: "Thanks for accepting the Code of Conduct!\n\n",
                color: 15515667
            }});
    }
}

module.exports = {
    exec: handlerFunction,
    commands: loadedCommands
}