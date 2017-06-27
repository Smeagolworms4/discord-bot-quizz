const Engine = require('discord.js');

class Game {
	
	/**
	 * @param {Discord} discord
	 * @param {Engine.TextChannel} channel
	 * @param {number} rounds
	 */
	constructor(discord, channel, rounds) {
		this._discord = discord;
		this._channel = channel;
		this._rounds = rounds;
		
		this._questions = [];
		this._scores = {};
		
		this._wait = false;
		this._to = setTimeout(this.step1.bind(this), 1000);
	}
	
	/**
	 * @return {Discord}
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
			" \n \n \n"+
			"\n======================================================\n \n"+
			"__QUESTION N°"+(this.current+1)+":__ dans 5 secondes\n"+
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
			" \n \n \n"+
			"\n======================================================\n \n"+
			"__QUESTION N°"+(this.current)+":__  ** ** ** ** **"+ question.text+"** ** ** ** ** "+ question.text+(question.timeout ? ' (vous avez '+question.timeout+' secondes)' : '')+"\n"+
			"\n======================================================\n \n"
		);
		this._wait = true;
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
		
		if (this._wait && this.lastQuestion && this.lastQuestion.match(content)) {
			this.channel.send(
				"\n======================================================\n \n"+
				"Bravo "+message.author+" vous avez trouvé la bonne réponse.\n"
			);
			
			if (!this._scores[message.author.id]) {
				this._scores[message.author.id] = {
					author: message.author,
					value: 0
				};
			}
			this._scores[message.author.id].value++;
			
			this.next();
		}
	}
	
	skip() {
		this.channel.send(
			"\n======================================================\n \n"+
			"Domage personne n'a trouvé la bonne réponse.\n"
		);
		this.next();
	}
	
	next() {
		
		this.displayScore();
		
		if (this.current == Math.min(this._rounds, this.questionManager.questions.length)) {
			
			this.displayFin();
			
			this.stop();
			delete(this.discord.games[this.channel.id]);
			return;
		}
		
		this._wait = false;
		if (this._to) {
			clearTimeout(this._to);
		}
		this._to = setTimeout(this.step1.bind(this), 1000);
	}
	
	displayFin() {
		
		let text = '';
		
		let scores = Object.keys(this._scores).map((key) => {
			return this._scores[key];
		});
		scores.sort((a, b) => {
			return b.value - a.value;
		});
		
		let l = 0;
		let before = null;
		for(let i = 0; i < scores.length; i++) {
			
			if (before != scores[i].value) {
				before = scores[i].value;
				l++;
			}
			
			let pre = l+'e ';
			if (l == 1) pre = ':first_place: ';
			if (l == 2) break;
			
			text += "\n  - "+pre+scores[i].author+": "+scores[i].value+' point(s)'
		}
		if (text == '') {
			text = "\n  - Aucun gagnant bande de loser ^^.\n"
		}
		
		
		this.channel.send(
			"\n:champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne:\n \n"+
			"Fin de la partie le gagnant est.... \n"
			+text+
			"\n\n\:champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne::champagne:\n \n"
		);
	}
	
	displayScore() {
		
		let text = '';
		
		let scores = Object.keys(this._scores).map((key) => {
			return this._scores[key];
		});
		scores.sort((a, b) => {
			return b.value - a.value;
		});
		
		let l = 0;
		let before = null;
		for(let i = 0; i < scores.length; i++) {
			
			if (before != scores[i].value) {
				before = scores[i].value;
				l++;
			}
			
			let pre = l+'e ';
			if (l == 1) pre = ':first_place: ';
			if (l == 2) pre = ':second_place: ';
			if (l == 3) pre = ':third_place: ';
			
			text += "\n  - "+pre+scores[i].author+": "+scores[i].value+' point(s)'
		}
		if (text == '') {
			text = "\n  - Aucune bonne réponses pour le moment.\n"
		}
		
		
		this.channel.send(
			"\n\n\n** Les scores sont:**\n"+
			text+
			"\n\n\n\n======================================================\n\n\n\n"
		);
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