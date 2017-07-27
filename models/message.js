// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var messageSchema = new Schema({ 
    message: { type: String, required: true }, 
    user: { type: String, required: true},  
},
{
    collection: 'messages'
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;