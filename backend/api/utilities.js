var userTable = "user";
var friendshipRequest = "friendshipRequest";
var friendship = "friendship";
var challenge = "challenge";
var openChallenge = "openChallenge";
var personalChallenge = "personalChallenge";
var completedChallenge = "completedChallenge";
var acceptedChallenge = "acceptedChallenge";
var votes = "votes";

module.exports = {

  init: (dbIn) => {
    db = dbIn;
  },

  handleError: function(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  },

  updateCred: function(req, res) {
	  var user = req.body.username;
	  var cred = req.body.cred;

	  db.collection(userTable).updateOne({"username" : user}, {$inc: {"cred": cred}}, function(err, doc) {
	    if (err) {
	      console.log(err);
	      res.status(400).send("error in updating cred");
	    } else {
	      res.status(201).json(doc);
	    }
	  });
	},

	addCred: function(req,res) {
	  db.collection(userTable).findOne({"username": req.body.username}).then( (user) => {
	    if (user == null) {
	      handleError(res,"No user found", "User not found");
	    }
	    else {
	      var newCrew = req.body.cred + user.cred;
	      db.collection(userTable).update({"username": req.body.username}, {$set: {cred: newCred} }).catch(console.log);
	      res.status(201).json({
	        "newCred": newCred
	      });
	    }
	  }).catch( (err) => {
	    console.log(err);
	    handleError(res,"Error in adding Cred", "Error in adding cred");
	  });
	}
}
