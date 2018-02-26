var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

var emoteList = [
				'./emotes/emote1.png',
				'./emotes/emote2.png',
				'./emotes/emote3.png',
				'./emotes/emote4.png',
				'./emotes/emote5.png',
				'./emotes/emote6.png',
				'./emotes/emote7.png',
				'./emotes/emote8.png',
				'./emotes/emote9.png',
				'./emotes/emote10.png',
				'./emotes/emote11.png',
				'./emotes/emote12.png',
				'./emotes/emote13.png',
				'./emotes/emote14.png',
				'./emotes/emote15.png',
				'./emotes/emote16.png',
				'./emotes/emote17.png',
				'./emotes/emote18.png',
				'./emotes/emote19.png'
				];

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with '.'
    if (message.substring(0, 1) == '.') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // .pingg
            case 'pingg':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
            
            case 'mfw':
            	var num = Math.floor(Math.random() * emoteList.length + 1);
            	var em = emoteList[num];
            	var e = "https://raw.githubusercontent.com/LaisieTaffy/SSSCbot/master/emotes/emote" + num + ".png";
            	var emote = e;
            	bot.uploadFile({
            		to: channelID,
            		file: em,
            		message: 'mfw'
            	});
            break;
            
            case 'playing':
            	var i = 0;
            	var game ="";
            	while(i < args.length()){
            		game += args[i];
            		i++;
            	}
            	bot.sendMessage({
            		to: channelID,
            		message: game
            	});
            	bot.setPresence({
            		name: game
            	});
            break;
         }
     }
});