class Response {
	
	constructor(text) {
		this._text = text;
	}
	
	get text() {
		return this._text;
	}
	
	match(content) {
		return this.text.replace(/[ \t\r\n]/g, '').toLocaleLowerCase() == content;
	}
	
}
module.exports = Response;