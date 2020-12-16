'use strict';

const Property = require('../models/property.js');

class PropertyList {
	
	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration.regnet.lists.property';
	}
	
	async getProperty(propertyKey) {
		let propertyCompositeKey = this.ctx.stub.createCompositeKey(this.name, propertyKey.split(':'));
		let propertyBuffer = await this.ctx.stub.getState(propertyCompositeKey);
		return Property.fromBuffer(propertyBuffer);
	}
	
	async addProperty(propertyObject) {
		let propertyCompositeKey = this.ctx.stub.createCompositeKey(this.name, propertyObject.getKeyArray());
		let propertyBuffer = propertyObject.toBuffer();
		await this.ctx.stub.putState(propertyCompositeKey, propertyBuffer);
	}
	
	async updateProperty(propertyObject) {
		let propertyCompositeKey = this.ctx.stub.createCompositeKey(this.name, key.split(':'));
		let propertyBuffer = propertyObject.toBuffer();
		await this.ctx.stub.putState(propertyCompositeKey, propertyBuffer);
	}
}

module.exports = PropertyList;