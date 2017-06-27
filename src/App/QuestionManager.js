const request = require('request-promise');
const csv = require('csvtojson')
const Question = require('./Model/Question.js');
const Response = require('./Model/Response.js');

class QuestionManager {
	
	/**
	 * @param {App} app
	 */
	constructor(app) {
		this._app = app;
		this._questions = [];
		
	}
	
	/**
	 * @returns {App}
	 */
	get app() {
		return this._app;
	}
	
	/**
	 * @returns {Question[]}
	 */
	get questions() {
		return this._questions;
	}
	
	/**
	 * @returns {Config}
	 */
	get config() {
		return this.app.config;
	}
	
	load() {
		let url = 'https://docs.google.com/spreadsheets/d/'+this.config.get('google_sheet')+'/export?format=csv';
		
		return request(url)
			.then((csvStr) => {
				let jsons = [];
				
				return new Promise((resolve, reject) => {
					csv({noheader:true})
						.fromString(csvStr)
						.on('csv',(json)=>{
							jsons.push(json.filter((value) => {
								return !!value.trim();
							}));
						})
						.on('done', (e) => {
							if (e)  {
								reject(e);
								return;
							}
							resolve(jsons);
						})
					;
				})
			})
			.then((json) => {
				
				this._questions = [];
				for(let i  = 1; i < json.length; i++) {
					let line  = json[i];
					if (line.length > 2) {
						
						let text    = line[0];
						let timeout = parseInt(line[1], 10);
						if (isNaN(timeout)) {
							timeout = 0;
						}
						
						let q = new Question(this._questions.length + 1, text, timeout);
						for(let j  = 1; j < line.length; j++) {
							let r = new Response(line[j]);
							q.addResponse(r);
						}
						this._questions.push(q);
					}
				}
				console.log('Questions loaded: ' + this._questions.length);
			})
		;
	}
	
	
	
}
module.exports = QuestionManager;