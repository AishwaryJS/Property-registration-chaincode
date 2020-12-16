'use strict';

const usersContract = require('./usersContract.js');
const registrarContract = require('./registrarContract.js');

module.exports.usersContract = UsersContract;
module.exports.registrarContract = RegistrarContract;

module.exports.contracts = [usersContract,registrarContract];