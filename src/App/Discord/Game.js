const Engine = require('discord.js');

class Game {
	
	/**
	 * @param {Discord} discord
	 * @param {Engine.TextChannel} channel
	 */
	constructor(discord, channel) {
		this._discord = discord;
		this._channel = channel;
		
		this._questions = [];
		
		this._to = setTimeout(this.step1.bind(this), 1000);
	}
	
	
	/**
	 * @returns {App}
	 */
	get discord() {
		return this._discord;
	}
	
	/**
	 * @returns {Engine.TextChannel}
	 */
	get channel() {
		return this._channel;
	}
	
	/**
	 * @returns {App}
	 */
	get app() {
		return this.discord.app;
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
	
	/**
	 * @returns {number}
	 */
	get current() {
		return this._questions.length;
	}
	
	/**
	 * @returns {Question}
	 */
	get lastQuestion() {
		return this._questions.length ?this._questions[this._questions.length - 1] : null;
	}
	
	step1() {
		this.channel.send(
			" \n"+
			"\n======================================================\n \n"+
			"QUESTION N°"+this.current+1+" dans 5 secondes\n"+
			" \n======================================================\n \n"+
			" \n"
		);
		this._to = setTimeout(this.step2.bind(this), 1000);
	}
	step2() {
		this.channel.send("4 ...");
		this._to = setTimeout(this.step3.bind(this), 1000);
	}
	step3() {
		this.channel.send("3 ...");
		this._to = setTimeout(this.step4.bind(this), 1000);
	}
	step4() {
		this.channel.send("2 ...");
		this._to = setTimeout(this.step5.bind(this), 1000);
	}
	step5() {
		this.channel.send("1 ...");
		this._to = setTimeout(this.step6.bind(this), 1000);
	}
	step6() {
		
		let question = this.newQuestion();
		this.channel.send(
			" \n"+
			"\n======================================================\n \n"+
			"QUESTION N°"+this.current+": "+ question.text+(question.timeout ? ' (vous avez '+question.timeout+' secondes)' : '')+"\n"+
			"\n======================================================\n \n"
		);
		this._to = null;
		if (question.timeout) {
			this._to = setTimeout(this.skip.bind(this), question.timeout * 1000);
		}
	}
	
	/**
	 * @param {Engine.Message} message
	 */
	respond(message) {
		
		let content  = message.content.replace(/[ \t\r\n]/g, '').toLowerCase();
		
		if (this.lastQuestion && this.lastQuestion.match(content)) {
			this.channel.send(
				"\n======================================================\n \n"+
				"Bravo "+message.author+" vous avez trouvé la bonne réponse.\n"+
				"\n======================================================\n \n"
			);
			this.next();
		}
	}
	
	skip() {
		this.channel.send(
			"\n======================================================\n \n"+
			"Domage personne n'a trouvé la bonne réponse.\n" +
			"\n======================================================\n \n"
		);
		this.next();
	}
	
	next() {
		if (this._to) {
			clearTimeout(this._to);
		}
		this._to = setTimeout(this.step6.bind(this), 1000);
	}
	
	/**
	 * @returns {Question}
	 */
	newQuestion() {
		let question = null;
		do {
			question = this.questionManager.questions[Math.floor(Math.random() * this.questionManager.questions.length)];
		} while (this._questions.indexOf(question) != -1);
		
		this._questions.push(question);
		return question;
	}
	
	stop() {
		if (this._to) {
			clearTimeout(this._to);
			this._to = null;
		}
	}
	
}
module.exports = Game;