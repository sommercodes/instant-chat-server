var express = require('express');

var router = express.Router();
var Message   = require('../../models/message'); // get our mongoose model
var config = require('../../config/config'); // get our config file

// get all messages
router.get('/messages', function(req, res) {
  Message.find({}, function(err, messages) {
    res.json(messages);
  });
}); 



module.exports = router;