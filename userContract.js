'use strict';

const {Contract, Context} = require('fabric-contract-api');

const User = require('./lib/models/users.js');
const Request = require('./lib/models/requests.js');
const Property = require('./lib/models/property.js');

const UserList = require('./lib/lists/userlist.js');
const RequestList = require('./lib/lists/requestslist.js');
const PropertyList = require('./lib/lists/propertylist.js');

class UserContext extends Context {
	constructor() {
		super();
		// Add various model lists to the context class object
		// this : the context instance
		this.userList = new UserList(this);
        this.requestList = new RequestList(this);
        this.propertyList = new PropertyList(this);
	}
}

class UserContract extends Contract {
	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration.userContract');
	}
	
	// Built in method used to build and return the context for this smart contract on every transaction invoke
	createContext() {
		return new UserContext();
	}
	
	async instantiate(ctx) {
		console.log('User Smart Contract Instantiated For Property Registration Network');
	}
	
	async requestNewUser(ctx, name, email, phoneNo, uId) {
		// Create a new composite key for the new request
		const requestKey = Request.makeKey([name,uId]);
		let existingRequest = await ctx.requestList
				.getRequest(requestKey)
				.catch(err => console.log('Provided user details are unique!'));
		
		// Make sure requests does not already exist.
		if (existingRequest !== undefined) {
			throw new Error('Invalid user details. A user request with these same details already exists.');
		} else {
			let requestObject = {
				name: name,
                email: email,
                phoneNo : phoneNo,
                uId : uId,
				createdBy: ctx.clientIdentity.getID(),
				createdAt: new Date(),
                updatedAt: new Date(),
                requestType : "AddUser"
			};
			
			let newRequestObject = Request.createInstance(requestObject);
			await ctx.requestList.addRequest(newRequestObject);
			return newRequestObject;
		}
    }
    
    async rechargeAccount (ctx, name, uId, bankTransactionId) {
        if(bankTransactionId == "upg100" || bankTransactionId == "upg500" || bankTransactionId == "upg500") {
            let balance = parseInt(bankTransactionId.substring(3));
            const userKey = User.makeKey([name,uId]);
		    let existingUser = await ctx.userList
				.getUser(userKey)
				.catch(err => console.log('Provided user details are unique!'));
		
            if (existingUser !== undefined) {
                let userObject = {
					name: name,
					email: existingUser.email,
					phoneNo : existingUser.phoneNo,
					uId : uId,
					upgradCoins : existingUser.upgradCoins + balance,
					createdBy: ctx.clientIdentity.getID(),
					createdAt: existingUser.CreatedAt,
					updatedAt: new Date(),
				};
                
                let newUserObject = User.createInstance(userObject);
				await ctx.userList.updateUser(newUserObject);
				return newUserObject;
            } 
            else {
                throw new Error('Invalid user details. A user request with these details does not exists.');
            }
        }
        else {
            throw new Error('Invalid bank transaction Id.');
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
    
    async propertyRegistrationRequest(ctx,propertyId,name,uId,price,status) {
        // Create a new composite key for the new request
		const requestKey = Request.makeKey([propertyId]);
		let existingRequest = await ctx.requestList
				.getRequest(requestKey)
				.catch(err => console.log('Provided user details are unique!'));
		
		// Make sure requests does not already exist.
		if (existingRequest !== undefined) {
			throw new Error('Invalid user details. A user request with these same details already exists.');
		} else {
			let requestObject = {
                propertyId: propertyId,
                owner: User.makeKey([name,uId]),
                price: price,
                status: status,
				createdBy: ctx.clientIdentity.getID(),
				createdAt: new Date(),
                updatedAt: new Date(),
                requestType : "AddProperty"
			};
			
			let newRequestObject = Request.createInstance(requestObject);
			await ctx.requestList.addRequest(newRequestObject);
			return newRequestObject;
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

    async updateProperty(propertyId,name,uId,status){
        const propertyKey = Property.makeKey([propertyId]);
        let existingProperty = await ctx.propertyList
            .getProperty(propertyKey)
            .catch(err => console.log('Provided user details are unique!'));
        if (existingProperty !== undefined && existingProperty.owner == User.makeKey([name,uId])) {
            let propertyObject = {
                propertyId: propertyId,
                owner: existingProperty.owner,
                price: existingProperty.price,
                status: status,
                createdBy: ctx.clientIdentity.getID(),
                createdAt: existingProperty.CreatedAt,
                updatedAt: new Date(),
            };

            let newPropertyObject = Property.createInstance(propertyObject);
            await ctx.propertyList.updateProperty(newPropertyObject);
            return newUserObject;
        }
        else{
            throw new Error('Invalid user details. A user request with these details does not exists.');
        }
    }

    async purchaseProperty(propertyId,name,uId){
        const propertyKey = Property.makeKey([propertyId]);
        let existingProperty = await ctx.propertyList
            .getProperty(propertyKey)
            .catch(err => console.log('Provided user details are unique!'));
        
        const userKey = User.makeKey([name,uId]);
        let existingUser = await ctx.userList
            .getUser(userKey)
            .catch(err => console.log('Provided user details are unique!'));

        if (existingProperty !== undefined && existingUser!== undefined ) {
            if(existingProperty.status === "onSale" && existingUser.upgradCoins >= existingProperty.price){
                let propertyObject = {
                    propertyId: propertyId,
                    owner: User.makeKey([name,uId]),
                    price: existingProperty.price,
                    status: "registered",
                    createdBy: ctx.clientIdentity.getID(),
                    createdAt: existingProperty.CreatedAt,
                    updatedAt: new Date(),
                };
    
                let newPropertyObject = Property.createInstance(propertyObject);
                await ctx.propertyList.updateProperty(newPropertyObject);
                
                existingUser.upgradCoins = existingUser.upgradCoins - existingProperty.price;
                existingUser.updatedAt = new Date();

                let buyerUserObject = User.createInstance(existingUser);
                await ctx.userList.updateUser(buyerUserObject);

                let sellerUserKey = User.makeKey(existingProperty.owner.split(":"));
                let sellerUser = await ctx.userList
                    .getUser(sellerUserKey)
                    .catch(err => console.log('Provided user details are unique!'));
                
                sellerUser.upgradCoins = sellerUser.upgradCoins + existingProperty.price;
                sellerUser.updatedAt = new Date();

                let sellerUserObject = User.createInstance(sellerUser);
                await ctx.userList.updateUser(sellerUserObject);
            }
            else{
                throw new Error('Property not on sale OR user has insufficient balance.');
            }
        }
        else{
            throw new Error('A user or property asset with these details does not exists.');
        }
    }
}

module.exports = UserContract;