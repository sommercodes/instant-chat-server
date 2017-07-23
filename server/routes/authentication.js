var express = require('express');

var router = express.Router();
var User   = require('../../models/user'); // get our mongoose model
var bcrypt = require('bcrypt');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config/config'); // get our config file
const saltRounds = 10; // used with bcrypt
var secret = config.secret;
var authenticate = require('../middleware/authentication');

//login route (POST http://localhost:8080/api/login)
router.post('/login', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

        // Load hash from your password DB. 
        bcrypt.compare(req.body.password, user.password, function(err, res2) {
            if (res2) {
                // if user is found and password is right
                query = {"name": req.body.name};
                update = {online: true}
                User.findOneAndUpdate(query, update, function(err, user) {
                if (err) {
                    console.log('got an error');
                }

                // at this point person is null.
                });
                // create a token
                var token = jwt.sign(user, secret, {
                    expiresIn: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
                });
            } else {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });

            }
        });

    }

  });
});

/*  
    route to return all users (GET http://localhost:8080/api/users)
    TODO: make this a private function
    protected route, must pass a token in the header
*/

router.get('/users', authenticate, function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
}); 

router.post('/logout', authenticate, function(req, res) {
    console.log('logging out');
    query = {"name": req.body.name};
    update = {online: false}
    User.findOneAndUpdate(query, update, function(err, user) {
        res.json({loggedOut: true});
        if (err) {
            console.log('got an error');
            res.Status(500);
        }
    });
}); 

//create a new user (POST http://localhost:8080/api/user)
router.post('/user', function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in password DB. 
        var newUser = new User({ 
        name: req.body.name, 
        password: hash,
        online: false
        });

        // save the sample user
        newUser.save(function(err) {
            if (err) {
                if (err.name === 'ValidationError'){
                    res.json({success: false, error: 'user exists'});
                }
                else {
                    res.json({success: false});
                }
                
            } else {

                console.log('User saved successfully');
                res.json({ success: true });
            }
        });
    });

});

module.exports = router;