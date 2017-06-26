const fs = require('fs-promise');
const extend = require('extend');

class Config {
	
	constructor() {
		this.values = {
			token: '',
			command: '!quizz'
		};
	}
	
	load() {
		console.log ('Load configuration.');
		
		return fs.readFile('./config.json', {encoding:'utf8'})
			.then((data) => {
				let json = JSON.parse(data);
				extend(this.values, json);
				return this.values;
			})
			.catch((e) => {
				console.error(e);
				return _this.values;
			})
		;
	}
	
	get(key) {
		return this.values[key];
	}

}
module.exports = Config;