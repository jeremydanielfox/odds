var userTable = "user";
var db;
var utilities = require('./utilities.js');


module.exports = {

  init: (dbIn) => {
    db = dbIn;
  },

  addUser: function(req, res) {
    var firstNameIn  = req.body.firstname;
    var lastNameIn = req.body.lastname;
    var passwordIn  = req.body.password;
    var usernameIn = req.body.username;
    var credIn  = 0;

    if (!firstNameIn || !lastNameIn || !passwordIn || !usernameIn) {
      console.log("ERROR: some fields in JSON were empty");
      res.status(400).send("Some of those fields were empty. Please provide a first name, last name, password, and username");
    } else {

  //TODO: check for duplicate user error message
  //TODO: Hash passwords

    var newUser = {
      "firstName": firstNameIn,
      "lastName" : lastNameIn,
      "password" : passwordIn,
      "username": usernameIn,
      "profpic": null,
      "friends": [],
      "acceptedChallenges": [],
      "notifications": {
        "friendRequests": [],
        "challengeRequests": []
      },
      "cred" : credIn
    }

    if (req.body.picture !== null) {
        newUser.profpic = req.body.picture;
    }

    db.collection(userTable).insertOne(newUser, function(err, doc) {
      if (err) {
        utilities.handleError(res, err.message, "Failed to add user.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
},

updateUser: function(req, res) {
  var usernameIn = req.body.username;
  var firstNameIn = req.body.firstname;
  var lastNameIn = req.body.lastname;
  var passwordIn  = req.body.password;
  var oldPassword = req.body.oldpassword;

  db.collection(userTable).findOne({"username": usernameIn, "password": oldPassword}, function(err, doc) {
    if (err) {
      console.log(err.message);
      res.status(400).send("Failed to find user");
    } else {
      if (!firstNameIn) {
        firstNameIn = doc.firstName;
      }
      if (!lastNameIn) {
        lastNameIn = doc.lastName;
      }
      if (!passwordIn) {
        passwordIn = doc.password;
      }

      db.collection(userTable).updateOne({"username" : usernameIn}, {$set: {"firstName": firstNameIn, "lastName": lastNameIn, "password": passwordIn}}, function(err, doc) {
        res.status(201).json(doc);
      });
    }
  });
},

addProfPic: function(req, res) {
  db.collection(userTable).findOne({"username": req.body.username}, function(err, doc) {
    if (err) {
      console.log(err);
      res.status(400).send("Failed to find user");
    } else {
      db.collection(userTable).updateOne({"username": req.body.username}, {$set: {"profpic": req.body.image}}, function(err, doc) {
        res.status(201).json(doc);
      });
    }
  });
},

getUserInfo: function(req, res) {
  db.collection(userTable).findOne({"username": req.body.username}, function(err, user) {
    if (err) {
      console.log(err);
      res.status(400).send("Failed to find user");
    } else {
      res.status(201).json({
        "cred": user.cred,
        "image": user.profpic
      })
    }
  });
}

}
