const Config  = require('./App/Config.js');
const Discord = require('./App/Discord.js');
const QuestionManager = require('./App/QuestionManager.js');

class App {
	
	constructor() {
		this._config = null;
		this._discord = null;
		this._questionManager = null;
	}
	
	/**
	 * @returns {Config}
	 */
	get config() {
		return this._config;
	}
	
	/**
	 * @returns {Discord}
	 */
	get discord() {
		return this._discord;
	}
	
	/**
	 * @returns {QuestionManager}
	 */
	get questionManager() {
		return this._questionManager;
	}
	
	run() {
		
		this._config = new Config();
		this._questionManager  = new QuestionManager(this);
		
		return this.config.load()
			.then(() => {
				return this._questionManager.load();
			})
			.then(() => {
				this._discord = new Discord(this);
				this.discord.connect();
			})
			.catch(function(e) {
				console.error(e);
			})
		;
	}
}
module.exports = App;