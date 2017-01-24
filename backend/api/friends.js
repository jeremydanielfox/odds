var userTable = "user";
var friendshipRequest = "friendshipRequest";
var friendship = "friendship";
var challenge = "challenge";
var openChallenge = "openChallenge";
var personalChallenge = "personalChallenge";
var completedChallenge = "completedChallenge";
var acceptedChallenge = "acceptedChallenge";
var votes = "votes";
var db;
var utilities = require('./utilities.js');

module.exports = {

  init: (dbIn) => {
    db = dbIn;
  },

addFriendRequest: (req, res) => {
  var fromUserIn = req.body.fromUser;
  var toUserIn = req.body.toUser;

  if (!(fromUserIn && toUserIn)) {
    utilities.handleError(res, "Invalid user input", "Must provide two usernames: (fromUser, toUser) ", 400);
  }

  db.collection(userTable).find( { username: { $in: [fromUserIn, toUserIn] }}, (err, cursor) => {
    if (err) {
      utilities.handleError(res,err.message, "Error occured");
    }
    var users = cursor.toArray();
    if (users.length < 2) {
      utilities.handleError(res, "Not enough users", "You sent a user that did not exist");
    } else {
      db.collection(userTable).update( {"username": toUserIn}, {$addToSet: {
        "notifications.friendRequests": fromUserIn
      } });
      res.status(200).json({
        "Result": "Sent successfully!"
      });
    }
  });
},

deleteFriendRequest: (req, res) => {
  var fromUserIn = req.body.fromUser;
  var toUserIn = req.body.toUser;

  if (!(fromUserIn && toUserIn)) {
    utilities.handleError(res, "Invalid user input", "Must provide two usernames: (fromUser, toUser) ", 400);
  }

  db.collection(userTable).find( { username: { $in: [fromUserIn, toUserIn] }}, (err, cursor) => {
    if (err) {
      utilities.handleError(res,err.message, "Error occured");
    }
    var users = cursor.toArray();
    if (users.length < 2) {
      utilities.handleError(res, "Not enough users", "You sent a user that did not exist");
    } else {
      db.collection(userTable).update( {"username": toUserIn}, {$pull: {
        "notifications.friendRequests": fromUserIn
      } });

      db.collection(userTable).findOne({"username" : toUserIn}, function(err, doc) {
        var friendsRequestsForResponse = [];
        for (i = 0; i < doc.notifications.friendRequests.length; i ++) {
          db.collection(userTable).findOne({"username": doc.notifications.friendRequests[i]}, function(err, data) {
            var user = {
              "firstname" : data.firstName,
              "lastname" : data.lastName,
              "username" : data.username,
              "cred" : data.cred
            }
            friendsRequestsForResponse.push(user);
          });
        }

        var response = {
          "friendRequests" : friendsRequestsForResponse
        }

        setTimeout(function() {
          res.status(200).json(response);
        }, 2000);
      });
    }
  });
},

addFriend: function(req, res) {
  var friendone = req.body.username1;
  var friendtwo = req.body.username2;

  if (!(friendone && friendtwo)) {
    utilities.handleError(res, "Invalid user input", "One or more friend spots are empty ", 400);
  }

  //TODO: figure out if the structure prevents you from friending someone who doesn't exist

// add to set method prevents duplicates from occurring
  db.collection(userTable).update({'username': friendone}, {$addToSet: {friends: friendtwo} });
  db.collection(userTable).update({'username': friendtwo}, {$addToSet: {friends: friendone} });

  // remove any instances of a friend request betwen these two people
  db.collection(userTable).update({'username': friendone}, {$pull: {"notifications.friendRequests": friendtwo}});
  db.collection(userTable).update({'username': friendtwo}, {$pull: {"notifications.friendRequests": friendone}});

  db.collection(userTable).findOne({"username" : friendone}, function(err, doc) {
    var friendsForResponse = [];
    for (i = 0; i < doc.friends.length; i ++) {
      db.collection(userTable).findOne({"username": doc.friends[i]}, function(err, data) {
        var user = {
          "firstname" : data.firstName,
          "lastname" : data.lastName,
          "username" : data.username,
          "cred" : data.cred
        }
        friendsForResponse.push(user);
      })
    }

    var friendsRequestsForResponse = [];
    for (i = 0; i < doc.notifications.friendRequests.length; i ++) {
      db.collection(userTable).findOne({"username": doc.notifications.friendRequests[i]}, function(err, data) {
        var user = {
          "firstname" : data.firstName,
          "lastname" : data.lastName,
          "username" : data.username,
          "cred" : data.cred
        }
        friendsRequestsForResponse.push(user);
      })
    }

    var response = {
      "friends" : friendsForResponse,
      "friendRequests" : friendsRequestsForResponse
    }

    setTimeout(function() {
      res.status(200).json(response);
    }, 2000);
  });
},


removeFriend: function(req, res) {
  var friendone = req.body.fromUser;
  var friendtwo = req.body.toUser;

  if (!(friendone && friendtwo)) {
    utilities.handleError(res, "Invalid user input", "Must provide two uids (fromUser, toUser) ", 400);
  }

  db.collection(userTable).update({'username': friendone}, {$pull: {"friends": friendtwo}});
  db.collection(userTable).update({'username': friendtwo}, {$pull: {"friends": friendone}});

  db.collection(friendship).remove({fromUser : fromUserIn, toUser : toUserIn}).toArray(function(err, docs) {
    if (err) {
      utilities.handleError(res, err.message, "Failed to remove friendship.");
    } else {
      res.status(201).json(docs);
    }
  });
},



getFriends: function(req, res) {
  var userIn = req.body.username;
  db.collection(userTable).findOne({"username": userIn}, function(err, doc) {
    if (err) {
      utilities.handleError(res, err.message, "Failed to find friends");
    } else {
      db.collection(userTable).find({"username" : {$in : doc.friends}}).toArray(function(err, data) {
        var userResponse = [];
        for (i = 0; i < data.length; i ++) {
          var user = {
            "firstname" : data[i].firstName,
            "lastname" : data[i].lastName,
            "username" : data[i].username,
            "cred" : data[i].cred
          }
          userResponse.push(user);
        }
        res.status(201).json(userResponse);
      })
    }
  })
},


getFriendRequests: function(req, res) {
  var userIn = req.body.username;
  db.collection(userTable).findOne({"username": userIn}, function(err, doc) {
    if (err) {
      utilities.handleError(res, err.message, "Failed to find friends");
    } else {
      db.collection(userTable).find({"username" : {$in : doc.notifications.friendRequests}}).toArray(function(err, data) {
        var userResponse = [];
        for (i = 0; i < data.length; i ++) {
          var user = {
            "firstname" : data[i].firstName,
            "lastname" : data[i].lastName,
            "username" : data[i].username,
            "cred" : data[i].cred
          }
          userResponse.push(user);
        }
        res.status(201).json(userResponse);
      })
    }
  })
},


searchFriends: function(req,res){
  var searchTerms = req.body.searchterms;

  if (!searchTerms){
    utilities.handleError(res, "No search terms.", "Must search for something.", 400);
  }

  db.collection(userTable).find( {$or: [
    {"firstName" : {$in: searchTerms}},
    {"lastName" : {$in: searchTerms}},
    {"username" : {$in: searchTerms}}] }).toArray(function(err,data) {
    if (err){
      utilities.handleError(res, err.message, "Failed to get global odds.");
    } else {
      res.status(200).json(data);
    }
  });
},

getFriendsFeed: function(req, res) {
  var user = req.body.username;
  if (!user) {
    handleError(res, "Missing username.", "Missing username.");
  }
  else {
    db.collection(userTable).findOne({"username" :user}, function(err, foundUser) {
      if (err || foundUser == null) {
        console.log(err);
        res.status(400).send(err);
      } else {
        var friends = foundUser.friends;
        friends.push(user);
        var challenges = [];
        db.collection(completedChallenge).find({completor : {$in: friends}}).toArray(function(err, data) {
          challenges = data;
        });

      setTimeout(function() {
        res.status(200).json(challenges);
      }, 2000);

      }
    });
  }
}


}
