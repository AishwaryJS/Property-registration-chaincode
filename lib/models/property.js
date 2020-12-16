'use strict';

class Property {
	
	constructor(propertyObject) {
		this.key = Property.makeKey([propertyObject.PropertyId]);
		Object.assign(this, propertyObject);
	}
	
	static getClass() {
		return 'org.property-registration.regnet.models.property';
	}
	
	static fromBuffer(buffer) {
		let json = JSON.parse(buffer.toString());
		return new Property(json);
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
	
	static createInstance(propertyObject) {
		return new Property(propertyObject);
	}
	
}

module.exports = Property;