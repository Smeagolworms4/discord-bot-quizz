const Engine = require('discord.js');
const Game = require('./Discord/Game.js');
	
class Discord {
	
	/**
	 * @param {App} app
	 */
	constructor(app) {
		this._app = app;
		this._engine = null;
		this._games = {};
	}
	
	/**
	 * @returns {App}
	 */
	get app() {
		return this._app;
	}
	
	/**
	 * @returns {Engine.Client}
	 */
	get engine() {
		return this._engine;
	}
	
	/**
	 * @return {{}}
	 */
	get games() {
		return this._games;
	}
	
	/**
	 * @returns {Config}
	 */
	get config() {
		return this.app.config;
	}
	
	/**
	 * @returns {QuestionManager}
	 */
	get questionManager() {
		return this.app.questionManager;
	}
	
	connect() {

		this._engine = new Engine.Client();
		this.engine.on('ready', () => {
			console.log('Bot QUIZZ: I am ready!');
		});
		
		this.engine.on('message', this.message.bind(this));
		
		let token = this.config.get('token');
		console.log('Connect _to discord with token: '+token);
		this.engine.login(token);
	}
	
	/**
	 * @param {Engine.Message} message
	 */
	message(message) {
		
		if (message.channel && message.channel instanceof Engine.TextChannel) {
			
			let channel = message.channel;
			let commands = message.content.split(' ').filter((str) => {
				return !!str.trim();
			});
			
			if (commands.length) {
				let first = commands.shift();
				let cmd = this.config.get('command').toLowerCase();
				
				if (first.toLowerCase() == cmd) {
					
					let action = commands.shift();
					let number = parseInt(commands.shift(), 10);
					if(action.toLowerCase() == Discord.CMD_START) {
						this.start(channel, isNaN(number) ? 10 : number);
						return;
					}
					if(action.toLowerCase() == Discord.CMD_STOP) {
						this.stop(channel);
						return;
					}
					if(action.toLowerCase() == Discord.CMD_LOAD) {
						this.questionManager.load(channel)
							.then(() => {
								channel.send('Rechargement des questions. '+this.questionManager.questions.length+' questions chargéés.');
							})
						;
						return;
					}
					if(action.toLowerCase() == Discord.CMD_SKIP) {
						if (this._games[channel.id]) {
							this._games[channel.id ].skip();
						}
						return;
					}
					if(action.toLowerCase() == Discord.CMD_HELP) {
						channel.send(
							"Les commandes du QUIIZ sont:\n\n"+
							" * **"+cmd+" "+Discord.CMD_HELP+"** : Affiche l'aide\n"+
							" * **"+cmd+" "+Discord.CMD_START+"** [Nombre de question(optionnel)] : Démarre une partie\n"+
							" * **"+cmd+" "+Discord.CMD_STOP+"** : Arrête la partie en court\n"+
							" * **"+cmd+" "+Discord.CMD_LOAD+"** : Recharge les questions\n"+
							" * **"+cmd+" "+Discord.CMD_SKIP+"** : Passe à la question suivante\n"
						);
						return;
					}
				}
				
				if (this._games[channel.id]) {
					this._games[channel.id ].respond(message);
				}
			}
		}
	}
	
	/**
	 * @param {Engine.TextChannel} channel
	 * @param {number} rounds
	 */
	start(channel, rounds) {
		if (this._games[channel.id]) {
			channel.send('Le QUIZZ est déjà en cours.');
		} else {
			channel.send('Démarrage du QUIZZ à '+rounds+' question(s) !!!');
			this._games[channel.id] = new Game(this, channel, rounds);
		}
	}
	
	/**
	 * @param {Engine.TextChannel} channel
	 */
	stop(channel) {
		if (this._games[channel.id]) {
			this._games[channel.id].stop();
			delete(this._games[channel.id]);
			channel.send('Arrêt du QUIZZ !!!');
		} else {
			channel.send('Aucun QUIZZ en cours.');
		}
	}
}
Discord.CMD_START = 'start';
Discord.CMD_STOP  = 'stop';
Discord.CMD_LOAD  = 'load';
Discord.CMD_SKIP  = 'skip';
Discord.CMD_HELP  = 'help';


module.exports = Discord;