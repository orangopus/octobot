let request = require("snekfetch");

module.exports = {
	name: "npm",
	description: "Get information about a NPM package.",
	protocol: function(bot, msg, args, options){
		if(!args[0]){
 	   		msg.channel.createMessage("No argument!");
  		}else{
		    request.get("https://registry.npmjs.org/"+args[0].toLowerCase())
		        .end((err, res)=>{
		          	if(res.statusCode = 200){
						msg.channel.createMessage("That isnt a npm package!");
					}else{
						i = res.body
						ver = i.versions[i['dist-tags'].latest]
						embed = {
						  	title: i.name+' **(**`'+i['dist-tags'].latest+'`**)**',
						  	description: `${i.description}\n`,
						  	url: `https://www.npmjs.com/package/${i.name}`,
							color: 0xc12127,
						  	fields: [
								{name: 'License', value: i.license, inline: true},
								{name: 'Created In', value: DateFormat(new Date(i.time.created)), inline: true},
								{name: 'Modified In', value: DateFormat(new Date(i.time.modified)), inline: true}
							],
						  	thumbnail: {
						  		url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/2000px-Npm-logo.svg.png'
						  	}
						}
						if(i.author!=undefined){
							embed.fields.push({
								name: 'Author',
								//value: `${i.author.name}${i.author.email ? ' [📧](mailto://'+i.author.email+')' : ''}${i.author.url ? ' [🌐]('+i.author.url+')' : ''}`,
								value: `${i.author.name}${i.author.email ? ' [Mail](mailto://'+i.author.email+')' : ''}${i.author.url ? ' [Website]('+i.author.url+')' : ''}`,
								inline: true
							});
						}
						if(i.keywords!=undefined){
							embed.fields.push({
								name: 'Keywords',
								value: i.keywords.join(', '),
								inline: true
							});
						}
						if(i.bugs!=undefined){
							embed.fields.push({
								name: 'Bug Tracker',
								value: i.bugs.url,
								inline: true
							});
			 			}
						if(i.repository!=undefined){
							embed.fields.push({
								name: `Repository (${i.repository.type})`,
								value: i.repository.url,
								inline: true
							});
						}
						if(ver.dependencies!=undefined){
							embed.fields.push({
								name: `Dependencies`,
								value: Object.keys(ver.dependencies).map(d=>d+' `'+ver.dependencies[d]+'`').join(', '),
								inline: true
							});
						}
						if(ver.devDependencies!=undefined){
							embed.fields.push({
								name: `Development Dependencies`,
								value: Object.keys(ver.devDependencies).map(d=>d+' `'+ver.devDependencies[d]+'`').join(', '),
								inline: true
							});
						}
						if(ver.peerDependencies!=undefined){
							embed.fields.push({
								name: `Peer Dependencies`,
								value: Object.keys(ver.peerDependencies).map(d=>d+' `'+ver.peerDependencies[d]+'`').join(', '),
								inline: true
							});
						}
						msg.channel.createMessage({embed: embed});
					}
				});
			}
	}
};