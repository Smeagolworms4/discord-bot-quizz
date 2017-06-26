const Engine = require('discord.js');
	
class Discord {
	
	/**
	 * @param {App} app
	 */
	constructor(app) {
		this._app = app;
		this._engin = null;
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
	 * @returns {Config}
	 */
	get config() {
		return this.app.config;
	}
	
	start () {
		this.connect();
	}
	
	connect() {

		this._engine = new Engine.Client();
		this.engine.on('ready', () => {
			console.log('Bot QUIZZ: I am ready!');
		});
		
		this.engine.on('message', this.message.bind(this));
		
		let token = this.config.get('token');
		console.log('Connect to discord with token: '+token);
		this.engine.login(token);
	}
	
	message(message) {
		
		let commands = message.content.split(' ').filter((str) => {
			return !!str.trim();
		});
		
		console.log('commands', commands);
		console.log(message);
		
		
		if (message.channel && message.channel instanceof Engine.TextChannel) {
			
			let channel = message.channel;
			
			if (commands.length) {
				let first = commands.shift();
				
				if (first.toLowerCase() == this.config.get('command').toLowerCase()) {
					
					let action = commands.shift();
					if(action == 'start') {
						channel.sendMessage('Démarrage du QUIZZ !!!')
					}
				}
			}
		}
		
		
	}
}
module.exports = Discord;