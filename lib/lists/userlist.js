'use strict';

const User = require('../models/users.js');

class UserList {
	
	constructor(ctx) {
		this.ctx = ctx;
		this.name = 'org.property-registration.regnet.lists.user';
	}
	
	async getUser(userKey) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, userKey.split(':'));
		let userBuffer = await this.ctx.stub.getState(userCompositeKey);
		return User.fromBuffer(userBuffer);
	}
	
	async addUser(userObject) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, userObject.getKeyArray());
		let userBuffer = userObject.toBuffer();
		await this.ctx.stub.putState(userCompositeKey, userBuffer);
	}
	
	async updateUser(userObject) {
		let userCompositeKey = this.ctx.stub.createCompositeKey(this.name, key.split(':'));
		let userBuffer = userObject.toBuffer();
		await this.ctx.stub.putState(userCompositeKey, userBuffer);
	}
}

module.exports = UserList;