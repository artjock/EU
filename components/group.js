var db = require('../middleware/db').db;
var Item = require('./item').Item;

module.exports.Group = Object.create(Item, {_collection: {value: 'groups', writable: true}});
