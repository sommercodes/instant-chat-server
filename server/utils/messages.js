var Message   = require('../../models/message'); // get our mongoose model

// add a new message
var saveMessage = function(message) {

  var newMsg = new Message({ 
    user: message.user, 
    message: message.message
  });

  // save the sample user
  newMsg.save(function(err) {
      if (err) {
        console.log('error saving message')
          
      } else {
          console.log('Message saved successfully');
      }
  });
}

module.exports = saveMessage;