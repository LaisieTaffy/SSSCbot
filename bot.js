var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs'),
	path = require('path');
var spawn = require('child_process').spawn;
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

/* Files */

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

var audioList = [
				'./audio/tata.mp3'
				];

/* Main? */

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with '.'
    var serverID = bot.channels[channelID].guild_id;
    var vcID = bot.servers[serverID].members[userID].voice_channel_id;
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
            	while(i < args.length){
            		game += args[i] + " ";
            		i++;
            	}
            	bot.setPresence({
            		game:{
            			name: game
            			}
            	});
            	bot.sendMessage({
            		to: channelID,
            		message: 'Playing ' + game
            	});
            break;
            
            case 'tata':
            	var audio = audioList[0];
            	bot.joinVoiceChannel(vcID, function(){
            		playAudio(vcID, audio);
            	});
            	var a = Math.floor(Math.random() * 15 + 1);
            	var i = 0;
            	var tat = "";
            	while (i < a){
            		tat += 'A';
            		i++;
            	}
            	bot.sendMessage({
            		to: channelID,
            		message: 'TAT' + tat
            	});
            break;
            
            case 'dc':
            	bot.leaveVoiceChannel(vcID, function(error, events) {
                //Check to see if any errors happen while leaving.
            		if (error){
                		bot.sendMessage({                        
                        	to: channelID,
                        	message: 'I am not in a voice channel!'    
                    	})
                	}
            	});
            break;
            
            case 'joins':
            	var audio = audioList[0];
            	bot.joinVoiceChannel(vcID, function(err, events) {
        			if (err) return console.error(err);
        				events.on('speaking', function(userID, SSRC, speakingBool) {
            				console.log("%s is " + (speakingBool ? "now speaking" : "done speaking"), userID );
        				});

        			bot.getAudioContext(vcID, function(err, stream) {
            			if (err) return console.error(err);
            				fs.createReadStream(audio).pipe(stream, {end: false});
            				stream.on('done', function() {
                				fs.createReadStream(audio).pipe(stream, {end: false});
            			});
        			});
    			});
    			bot.sendMessage({
    				to: channelID,
    				message: 'Moshi moshi'
    			});
    		break;
    		
    		case 'join':
            	bot.joinVoiceChannel(vcID, function(err, events) {
        			if (err) return console.error(err);
        				events.on('speaking', function(userID, SSRC, speakingBool) {
            				console.log("%s is " + (speakingBool ? "now speaking" : "done speaking"), userID );
        				});
    			});
    			bot.sendMessage({
    				to: channelID,
    				message: 'Moshi moshi'
    			});
    		break;
            				
         }
     }
});

bot.on('any', function(event) {
	console.log(event)
});

bot.on('disconnect', function() {
	console.log("Bot disconnected");
	bot.connect()
});

/* Commands */

function playAudio(channel, file) {
    bot.getAudioContext(channel, function(error, stream) {
    	if (error) return console.error(error);  
        fs.createReadStream(file).pipe(stream, {end: false});
        stream.on('done', function() {
            bot.leaveVoiceChannel(channel, function(error, events) {
                //Check to see if any errors happen while leaving.
            		if (error){
                    	return console.log("Didit not in a voice channel!");
                	}
            });
        });
    })	;
}