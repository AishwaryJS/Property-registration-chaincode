'use strict';

const {Contract, Context} = require('fabric-contract-api');

const User = require('./lib/models/users.js');
const Request = require('./lib/models/requests.js');
const Property = require('./lib/models/property.js');

const UserList = require('./lib/lists/userlist.js');
const RequestList = require('./lib/lists/requestslist.js');
const PropertyList = require('./lib/lists/propertylist.js');

class RegistrarContext extends Context {
	constructor() {
		super();
		// Add various model lists to the context class object
		// this : the context instance
		this.userList = new UserList(this);
        this.requestList = new RequestList(this);
        this.propertyList = new PropertyList(this);
	}
}

class RegistrarContract extends Contract {
	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration.registrarContract');
	}
	
	// Built in method used to build and return the context for this smart contract on every transaction invoke
	createContext() {
		return new RegistrarContext();
	}
	
	async instantiate(ctx) {
		console.log('Registrar Smart Contract Instantiated For Property Registration Network');
	}
	
	async approveNewUser(ctx, name, uId) {
		const requestKey = Request.makeKey([name,uId]);
		let existingRequest = await ctx.requestList
				.getRequest(requestKey)
				.catch(err => console.log('Provided user details are unique!'));
		
		if (existingRequest !== undefined) {

			const userKey = User.makeKey([name,uId]);
			let existingUser = await ctx.userList
				.getUser(userKey)
				.catch(err => console.log('Provided user details are unique!'));

			if (existingUser !== undefined) {
				throw new Error('User already exists in the system.');
			}
			else{
				let userObject = {
					name: name,
					email: existingRequest.email,
					phoneNo : existingRequest.phoneNo,
					uId : uId,
					upgradCoins : 0,
					createdBy: ctx.clientIdentity.getID(),
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				
				let newUserObject = User.createInstance(userObject);
				await ctx.userList.addUser(newUserObject);
				return newUserObject;
			}
		} 
		else {
			throw new Error('Invalid user details. A user request with these details does not exists.');
		}
	}

	async viewUser (ctx, name, uId) {
        const userKey = User.makeKey([name,uId]);
        let existingUser = await ctx.userList
            .getUser(userKey)
            .catch(err => console.log('Provided user details are unique!'));
        if (existingUser !== undefined) {
            return existingUser;
        }
        else{
            throw new Error('Invalid user details. A user request with these details does not exists.');
        }
	}

	async approvePropertyRegistration(propertyId){
		const requestKey = Request.makeKey([propertyId]);
		let existingRequest = await ctx.propertyList
				.getProperty(requestKey)
				.catch(err => console.log('Provided user details are unique!'));
		
		if (existingRequest !== undefined) {

			const propertyKey = User.makeKey([propertyId]);
			let existingProperty = await ctx.PropertyList
				.getProperty(propertyKey)
				.catch(err => console.log('Provided user details are unique!'));

			if (existingProperty !== undefined) {
				throw new Error('Property already exists in the system.');
			}
			else{
				let propertyObject = {
					propertyId: propertyId,
					owner: existingRequest.owner,
					price: existingRequest.price,
					status: existingRequest.status,
					createdBy: ctx.clientIdentity.getID(),
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				
				let newPropertyObject = Property.createInstance(propertyObject);
				await ctx.propertyList.addProperty(newPropertyObject);
				return newPropertyObject;
			}
		} 
		else {
			throw new Error('Invalid user details. A user request with these details does not exists.');
		}
	}

	async viewProperty(propertyId){
        const propertyKey = Property.makeKey([propertyId]);
        let existingProperty = await ctx.propertyList
            .getProperty(propertyKey)
            .catch(err => console.log('Provided user details are unique!'));
        if (existingProperty !== undefined) {
            return existingProperty;
        }
        else{
            throw new Error('Invalid user details. A user request with these details does not exists.');
        }
    }
}

module.exports = RegistrarContract;