'use strict';

class Request {
	
	constructor(requestObject) {
		this.key = Request.makeKey([requestObject.Name,requestObject.uId]);
		Object.assign(this, requestObject);
	}
	
	static getClass() {
		return 'org.property-registration.regnet.models.request';
	}
	
	static fromBuffer(buffer) {
		let json = JSON.parse(buffer.toString());
		return new Request(json);
	}
	
	toBuffer() {
		return Buffer.from(JSON.stringify(this));
	}
	
	static makeKey(keyParts) {
		return keyParts.map(part => JSON.stringify(part)).join(":");
	}
	
	getKeyArray() {
		return this.key.split(":");
	}
	
	static createInstance(requestObject) {
		return new Request(requestObject);
	}
	
}

module.exports = Request;