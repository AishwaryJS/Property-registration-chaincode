'use strict';

class User {
	
	constructor(userObject) {
		this.key = User.makeKey([userObject.Name,userObject.UId]);
		Object.assign(this, userObject);
	}
	
	static getClass() {
		return 'org.property-registration.regnet.models.user';
	}
	
	static fromBuffer(buffer) {
		let json = JSON.parse(buffer.toString());
		return new User(json);
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
	
	static createInstance(userObject) {
		return new User(userObject);
	}
	
}

module.exports = User;