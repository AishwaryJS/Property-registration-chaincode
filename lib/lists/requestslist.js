'use strict';

const Request = require('../models/requests.js');

class RequestList {
	
	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration.regnet.lists.request';
	}
	
	async getRequest(requestKey) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestKey.split(':'));
		let requestBuffer = await this.ctx.stub.getState(requestCompositeKey);
		return Request.fromBuffer(requestBuffer);
	}
	
	async addRequest(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestObject.getKeyArray());
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}
	
	async updateRequest(requestObject) {
		let requestCompositeKey = this.ctx.stub.createCompositeKey(this.name, key.split(':'));
		let requestBuffer = requestObject.toBuffer();
		await this.ctx.stub.putState(requestCompositeKey, requestBuffer);
	}
}

module.exports = RequestList;