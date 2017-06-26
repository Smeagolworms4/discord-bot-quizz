const Config  = require('./App/Config.js');
const Discord = require('./App/Discord.js');


class App {
	
	constructor() {
		this._config = null;
		this._discod = null;
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
	get discod() {
		return this._discod;
	}
	
	run() {
		
		this._config = new Config();
		
		return this.config.load()
			.then((config) => {
				
				console.log('Configuration loaded', config);
				
				this._discod = new Discord(this);
				this.discod.start();
			})
			.catch(function(e) {
				console.error(e);
			})
		;
	}
}
module.exports = App;