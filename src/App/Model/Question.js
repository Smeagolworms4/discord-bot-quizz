class Question {
	
	constructor(id, text, timeout) {
		this._id = id;
		this._text = text;
		this._timeout = timeout;
		this._responses = [];
	}
	
	get id() {
		return this._id;
	}
	
	get text() {
		return this._text;
	}
	
	get timeout() {
		return this._timeout;
	}
	
	get responses() {
		return this._responses;
	}
	
	addResponse(response) {
		this._responses.push(response);
	}
	
	match(content) {
		for(let i = 0; i < this.responses.length; i++) {
			if (this.responses[i].match(content)) {
				return true;
			}
		}
		return false;
	}
}

module.exports = Question;