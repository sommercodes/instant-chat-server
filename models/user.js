// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

// set up a mongoose model and pass it using module.exports
var userSchema = new Schema({ 
    name: { type: String, index: true, required: true, unique: true }, 
    password: { type: String, required: true}, 
    online: { type: Boolean, required: true}, 
},
{
    collection: 'users'
});

userSchema.plugin(uniqueValidator);

var User = mongoose.model('User', userSchema);

module.exports = User;