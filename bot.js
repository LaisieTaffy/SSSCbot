var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs'),
	path = require('path');
var spawn = require('child_process').spawn;
var deck = require('./src/deck.js');
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

/* Files and variables */

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
				
var offNotCalled = true;

var aDeck,
	playerHand,
	botHand;

/* Deck */


/* Command arguments */

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
    		
    		case 'off':
    			offNotCalled = false;
    			bot.disconnect()
    		break;
 /*   		
    		case 'blackjack':
    			aDeck = new deck.Deck()
    			deck.shuffle(aDeck);
    			playerHand = new deck.Hand();
    			botHand = new deck.Hand();
    			var x = 0;
    			while (x < 2) {
    				deck.addToHand(playerHand, deck.draw(aDeck));
    				deck.addToHand(botHand, deck.draw(aDeck));
    				x++;
    			}
    			var botsHand = "My hand: " + botHand.hand[0].rank + " " + botHand.hand[0].suit + " and " + botHand.hand[1].rank + " " + botHand.hand[1].suit;
    			var playersHand = "Your hand: " + playerHand.hand[0].rank + " " + playerHand.hand[0].suit + " and " + playerHand.hand[1].rank + " " + playerHand.hand[1].suit;
    			bot.sendMessage({
    				to: channelID,
    				message: botsHand + "\n" + 
    						 playersHand + "\n" +
							 "Hit / Stand"
				});
    		break;
    		
    		case 'hit':
    			deck.addToHand(playerHand, deck.draw(aDeck));
    			var botsHand = "My hand: " + botHand.hand[0].rank + " " + botHand.hand[0].suit + " and " + botHand.hand[1].rank + " " + botHand.hand[1].suit;
    			var playersHand = "Your hand: " + playerHand.hand[0].rank + " " + playerHand.hand[0].suit;
    			var i = 1;
    			while (i < playerHand.hand.length) {
    				playersHand += " and " + playerHand.hand[i].rank + " " + playerHand.hand[i].suit;
    			}
    			bot.sendMessage({
    				to: channelID,
    				message: botsHand + "\n" + 
    						 playersHand + "\n" +
							 "Hit / Stand"
				});
			break;
			
			case 'stand':
				var botsHand = "My hand: " + botHand.hand[0].rank + " " + botHand.hand[0].suit;
    			var playersHand = "Your hand: " + playerHand.hand[0].rank + " " + playerHand.hand[0].suit;
    			var i = 1;
    			while (i < playerHand.hand.length) {
    				playersHand += " and " + playerHand.hand[i].rank + " " + playerHand.hand[i].suit;
    			}
    			i = 1;
    			while (i < botHand.hand.length) {
    				botHand += " and " + botHand.hand[i].rank + " " + botHand.hand[i].suit;
    			}
    			var botScore = deck.handCalculate(botHand);
    			var playerScore = deck.handCalculate(playerHand);
    			if (botScore > playerScore){
    				bot.sendMessage({
    					to: channelID,
    					message: botsHand + "\n" + 
    						 	 playersHand + "\n" +
							 	 "I win"
					});
				}
				if (botScore < playerScore){
    				bot.sendMessage({
    					to: channelID,
    					message: botsHand + "\n" + 
    						 	 playersHand + "\n" +
							 	 "You win"
					});
				}
				if (botScore == playerScore){
    				bot.sendMessage({
    					to: channelID,
    					message: botsHand + "\n" + 
    						 	 playersHand + "\n" +
							 	 "It's a tie"
					});
				}
			break;
*/    			
            				
         }
     }
});

/* Automatic responses */

bot.on('any', function(event) {
	if (event.t == 'MESSAGE_CREATE' && event.d.author.id == '417131923710672897' && event.d.content.includes('TATA')) {
		bot.addReaction({
			channelID: event.d.channel_id,
			messageID: event.d.id,
			reaction: {id: '406214261443133460'}
		});
	}
	
	if (event.t == 'MESSAGE_CREATE' && event.d.author.id == '417131923710672897' && event.d.content.includes('Dota 2 Update')) {
		var postHTML = event.d.content;
		var postArr = postHTML.split('<br>');
		var postPlain = "";
		var i = 0;
		while (i < postArr.length) {
			postPlain =+ postArr[i] + "\n";
			i++;
		}
		bot.sendMessage({
			to: event.d.channel_id,
			message: postPlain
		});
	}
	global.gc();
});

bot.on('disconnect', function() {
	if (offNotCalled) {
		bot.connect()
	}
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