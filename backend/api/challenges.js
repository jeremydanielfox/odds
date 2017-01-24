var userTable = "user";
var friendshipRequest = "friendshipRequest";
var friendship = "friendship";
var challenge = "challenge";
var openChallenge = "openChallenge";
var personalChallenge = "personalChallenge";
var completedChallenge = "completedChallenge";
var acceptedChallenge = "acceptedChallenge";
var votes = "votes";
var utilities = require('./utilities.js');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

module.exports = {

  init: (dbIn) => {
    db = dbIn;
  },

  getUserCompletedChallenges: function(req, res) {
	  var user = req.body.username;

	  if (!user) {
	    utilities.handleError(res, "Missing username.", "Missing username.");
	  }
	  else {
	    db.collection(completedChallenge).find({"completor" : user}).toArray(function(err, doc) {
	      if (err || doc == null) {
	        utilities.handleError(res, "Error getting completed challenges.", "Error getting completed challenges.");
	      }
	      else {
	        res.status(201).json(doc);
	      }
	    });
	  }
	},

	getChallengeInfo: function(req,res) {
	  var challengeId = req.body.challengeId;

	  if (!challengeId) {
	    utilities.handleError(res, "Missing challengeId.", "Missing challengeId.");
	  }
	  else {
	    db.collection(openChallenge).findOne({"_id" : ObjectID(challengeId)}, function(err, doc) {
	      if (err) {
	        utilities.handleError(res, "Error in getChallengeInfo.", "Error in getChallengeInfo.");
	      }
	      else if (doc != null) {
	        res.status(200).json(doc);
	      }
	      else {
	        db.collection(personalChallenge).findOne({"_id" : ObjectID(challengeId)}, function(err, doc2) {
	          if (err) {
	            utilities.handleError(res, "Error in getChallengeInfo.", "Error in getChallengeInfo.");
	          }
	          else if (doc2 == null) {
	              utilities.handleError(res, "No Challenge Found.", "No Challenge Found.");
	          }
	          else {
	            res.status(200).json(doc2);
	          }
	        });
	      }
	    });
	  }
	},

	getCompletedChallenges: function(req,res) {
	  var challengeId = req.body.challengeId;

	  if (!challengeId) {
	    utilities.handleError(res, "Missing challengeId.", "Missing challengeId.");
	  }
	  else {
	    db.collection(openChallenge).findOne({"_id" : ObjectID(challengeId)}, function(err, doc) {
	      if (err || doc == null){
	        utilities.handleError(res, err.message, "Failed to get completed challenges.");
	      } else {
	        db.collection(completedChallenge).find({"challengeId" : challengeId}).toArray(function(err,data) {
	          if (err || data == null){
	            utilities.handleError(res, err.message, "Failed to get completed challenges.");
	          } else {
	            var response = [];
	            for (i = 0; i < data.length; i++) {
	              var nextResponse = {
	                "image" : data[i].image,
	                "completor" : data[i].completor,
	                "challengeName" : doc.challengeName
	              }
	              response.push(nextResponse);
	            }
	            res.status(201).json(response);
	          }
	        });
	      }
	    });
	  }
	},

	getCompletedChallengesGeneral: function(req,res) {
	  db.collection(completedChallenge).find().toArray(function(err,data) {
	    if (err){
	      utilities.handleError(res, err.message, "Failed to get global odds.");
	    } else {
	      res.status(200).json(data);
	    }
	  });
	},

	postCompletedChallenge: function(req, res) {
	  var user  = req.body.username;
	  var challengeId = req.body.challengeId;
	  var cred = req.body.cred;
	  var photoIn = req.body.photo;

	  //TODO: add user validation checks
	  //TODO: add challenge validation check

	  if (!user || !challengeId) {
	    utilities.handleError(res, "First name, challenge, or cred empty", "You must provide a first name, a challenge, and a cred value.", 400);
	  }
	  else {
	    var challenge = {
	      "completor": user,
	      "challengeId" : challengeId,
	      "image": photoIn
	    }

	    db.collection(personalChallenge).update({"_id" : challengeId}, {$set: {"state" : "completed"}}, function(err, doc) {
	      db.collection(acceptedChallenge).remove({"username" : user, "challengeId" : challengeId}, function(err, data) {
	        if (err) {
	          utilities.handleError(res, "Error removing accepted challenge.", "Error removing accepted challenge.", 400);
	        }
	        else {
	          db.collection(userTable).update({"username" : user}, {$inc: {"cred": cred*10}}, (err, count, status) => {
	            if (err) {
	              console.log(err);
	              res.status(400).send(err.message);
	            } else {
	              db.collection(completedChallenge).insertOne(challenge, (err, doc) => {
	                if (err) {
	                    console.log(err);
	                    res.status(400).send(err.message);
	                } else {
	                  res.status(201).json(doc);
	                }
	              });
	            }
	          });
	        }
	      });
	    });
	  }

	  //TODO: validation check on image size/image string length

	  //TODO: check for duplicate user error message
	  //TODO: Hash passwords
	},

	getPendingChallenges: function(req,res){
	  var username = req.body.username;

	  if (!username){
	    utilities.handleError(res, "Missing values.", "Missing one or more of: username.");
	  } else {
	    //TODO: check that username is valid

	    db.collection(userTable).findOne({"username": username}, function(err, data){
	      if(err){
	        utilities.handleError(res, err.message, "Failed to get global odds.");
	      } else if (!data){
	        utilities.handleError(res, "No user found.", "Invalid username given.");
	      } else {
	        //get challenges TO you that are "init" "responded" "failed"
	        //get challenges FROM you that are "init" "responded" "failed" "accepted"
	        db.collection(personalChallenge).find(
	          {$or: [{"state": "init", "fromUser": username}, {"state": "init", "toUser": username}, {"state": "responded", "fromUser": username},
	          {"state": "responded", "toUser": username}, {"state": "accepted", "fromUser": username}, {"state": "failed", "fromUser": username},
	          {"state": "failed", "toUser": username}]}).sort({"state":1}).toArray(function(err,data) {
	            if (err){
	              utilities.handleError(res, err.message, "Failed to get global odds.");
	            } else {
	              res.status(200).json(data);
	            }
	        });
	      }
	    });
	  }
	},

	respondPersonalChallenge: function(req,res){
	  var challengeId = req.body.challengeid;
	  var upperBound = req.body.upperbound;
	  var toUserNumber = req.body.tousernumber;

	  //TODO: check that challenge ID is valid and that upper bound is >= 2 and chosen number is in the range

	  if(!challengeId || !upperBound || !toUserNumber){
	    utilities.handleError(res, "Missing values.", "Missing one or more of: challenge id, upper bound, to user number.");
	  } else if (upperBound < 2 || toUserNumber > upperBound || toUserNumber < 1){
	    utilities.handleError(res, "Invalid input.", "Upper bound must be at least 2.  User number must be >= 1 and <= upper bound.");
	  } else {
	    db.collection(personalChallenge).findOne({"_id": ObjectID(challengeId)}, function(err, data){
	      if (err){
	        utilities.handleError(res, err.message, "Invalid challenge id.");
	      } else if (!data) {
	        utilities.handleError(res, "Invalid challenge id.", "Invalid challenge id.");
	      } else {
	          db.collection(personalChallenge).updateOne(
	            {"_id" : ObjectID(challengeId)},
	            {$set: {"upperBound": upperBound, "toUserNumber": toUserNumber, "state": "responded"}}, function(err, doc) {
	              if(err){
	                utilities.handleError(res, err.message, "Failed to respond to personal challenge");
	              } else{
	                  res.status(201).json(doc);
	              }
	          });
	      }
	    });
	  }
	},

	personalChallenge: function(req, res){
	  var challengeText = req.body.challenge;
	  var challengeName = req.body.challengename;
	  var fromUser = req.body.fromuser;
	  var toUser = req.body.touser;
	  var upperBound = null;
	  var toUserNumber = null;
	  var state = "init";

	  //TODO: check that UIDs are valid
	  if(!challengeText){
	    utilities.handleError(res, "Challenge text empty.", "Must enter a challenge.", 400);
	  } else if(!fromUser){
	    utilities.handleError(res, "Need a from user.", "Need a from user.", 400);
	  } else if (!toUser){
	    utilities.handleError(res, "Need a target user.", "Need a target user.", 400);
	  } else if(!challengeName){
	    utilities.handleError(res, "Challenge needs a name.", "Name the challenge.", 400);
	  } else {
	    var time = new Date();

	    var newPersonalChallenge = {
	      "challengeText" : challengeText,
	      "challengeName" : challengeName,
	      "toUser" : toUser,
	      "fromUser" : fromUser,
	      "timestamp" : time,
	      "upperBound" : upperBound,
	      "toUserNumber" : toUserNumber,
	      "state" : state
	    }

	    db.collection(personalChallenge).insertOne(newPersonalChallenge, function(err,doc) {
	      if (err) {
	        handleError(res, err.message, "Failed to post personal challenge.");
	      } else {
	        res.status(201).json(doc);
	      }
	    });
	  }
	},

	deleteFailedChallenges: function(req, res) {
	  var user = req.body.username;

	  if (!user) {
	    utilities.handleError(res, "Username is empty.", "Must enter a username.", 400);
	  }
	  else {
	    db.collection(personalChallenge).remove({"toUser" : user, "state" : "failed"}, function(err, doc) {
	      if (err) {
	        utilities.handleError(res, err.message, "Failed to remove failed challenges.");
	      }
	      else if (doc == null) {
	        utilities.handleError(res, err.message, "No matching record found in personalChallenge document.");
	      }
	      else {
	        res.status(201).json(doc);
	      }
	    })
	  }
	},

	failedChallenge: function(req, res) {
	  var user = req.body.username;
	  var challengeId = req.body.challengeId;

	  if(!user){
	    utilities.handleError(res, "Username is empty.", "Must enter a username.", 400);
	  }
	  else if(!challengeId){
	    utilities.handleError(res, "Challenge id empty.", "Must enter a challenge id.", 400);
	  }
	  else {
	    db.collection(personalChallenge).updateOne({"toUser" : user, "_id" : ObjectID(challengeId)}, {$set : {"state" : "failed"}}, function(err, doc) {
	      if (err) {
	        utilities.handleError(res, err.message, "Failed to set challenge to failed.");
	      }
	      else if (doc == null) {
	        utilities.handleError(res, err.message, "No matching record found in personalChallenge document.");
	      }
	      else {
	        res.status(201).json(doc);
	      }
	    });
	  }
	},

	getAcceptedChallenges: function(req,res) {
	  var user = req.body.username;
	  db.collection(acceptedChallenge).find({"username" : user}).toArray(function(err,data) {
	    if (err){
	      utilities.handleError(res, err.message, "Failed to get global odds.");
	    } else {
	      var challenges = [];
	      for (i = 0; i < data.length; i++) {
	        var challengeDB = ""
	        if (data[i].challengeType == "global") {
	          challengeDB = openChallenge;
	        }
	        else if (data[i].challengeType == "personal") {
	          challengeDB = personalChallenge;
	        }

	        db.collection(challengeDB).findOne({"_id" : ObjectID(data[i].challengeId)}, function(err, doc) {
	          challenges.push(doc);
	        });
	      }

	      setTimeout(function() {
	        res.status(200).json(challenges);
	      }, 2000);
	    }
	  });
	},

	acceptedChallenge: function(req,res){
	  var requestCompleted = false;
	  var user = req.body.username;
	  var challengeId = req.body.challengeId;
	  var challengeType = req.body.challengeType;

	  if(!user || !challengeId || !challengeType){
	    utilities.handleError(res, "Missing values.", "Don't have all of the required info to post challenge.", 400);
	  }

	  if(challengeType == "global"){
	    db.collection(openChallenge).findOne({ "_id" : ObjectID(challengeId)}, function(err,doc){
	      if(doc == null){
	        utilities.handleError(res, "No challenge found.", "No matching challenge.", 400);
	        requestCompleted = true;
	      }
	    });
	  }
	  else if(challengeType == "personal"){
	    db.collection(personalChallenge).updateOne({ "_id" : ObjectID(challengeId), "toUser" : user}, {$set: {"state" : "accepted"}}, function(err,doc){
	      if(doc == null){
	        utilities.handleError(res, "No challenge found.", "No matching challenge.", 400);
	        requestCompleted = true;
	      }
	    });
	  }
	  else {
	      utilities.handleError(res, "Invalid Challenge Type.", "Invalid Challenge Type.", 400);
	      requestCompleted = true;
	  }

	  var newAcceptedChallenge = {
	    "username" : user,
	    "challengeId" : challengeId,
	    "challengeType" : challengeType
	  }

	  setTimeout(function() {
	    if (requestCompleted == false) {
	      db.collection(acceptedChallenge).insertOne(newAcceptedChallenge, function(err,doc) {
	        if (err) {
	          utilities.handleError(res, err.message, "Failed to store accepted challenge.");
	        } else {
	          res.status(200).json(doc);
	        }
	      });
	    }
	  }, 2000);
	},

	getGlobalChallenges: function(req,res) {
	  db.collection(openChallenge).find().toArray(function(err,data) {
	    if (err){
	      handleError(res, err.message, "Failed to get global odds.");
	    } else {
	      res.status(200).json(data);
	    }
	  });
	},

	postGlobalChallenge: function(req, res) {
	  var challengeText = req.body.challenge;
	  var oddsUpperBound = req.body.upperbound;
	  var challengeName = req.body.challengename;
	  var postingUser = req.body.fromuser;

	  if(!challengeText){
	    utilities.handleError(res, "Challenge text empty.", "Must enter a challenge.", 400);
	  }
	  if(!oddsUpperBound){
	    utilities.handleError(res, "No upper bound given.", "Supply upper bound.", 400);
	  }
	  if (!(oddsUpperBound >= 2)){
	    utilities.handleError(res, "Range Issue", "Upper bound must be at least 2.", 400);
	  }
	  if(!challengeName){
	    utilities.handleError(res, "Challenge needs a name.", "Name the challenge.", 400);
	  }
	    if(!postingUser){
	    utilities.handleError(res, "Challenge needs a posting user.", "Who are you.", 400);
	  }

	  var time = new Date();

	  var newOpenChallenge = {
	    "challengeText" : challengeText,
	    "upperBound" : oddsUpperBound,
	    "challengeName" : challengeName,
	    "fromUser" : postingUser,
	    "timestamp" : time
	  }

	  db.collection(openChallenge).insertOne(newOpenChallenge, function(err,doc) {
	    if (err) {
	      utilities.handleError(res, err.message, "Failed to global odds challenge.");
	    } else {
	      res.status(201).json(doc.ops[0]);
	    }
	  });
	},


}