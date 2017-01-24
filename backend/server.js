var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var Promise = require("bluebird");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

// import from APIs
var user =  require('./api/user.js');
var challenges = require('./api/challenges.js');
var friends = require('./api/friends.js');
var utilities = require('./api/utilities.js');

var userTable = "user";
var friendshipRequest = "friendshipRequest";
var friendship = "friendship";
var challenge = "challenge";
var openChallenge = "openChallenge";
var personalChallenge = "personalChallenge";
var completedChallenge = "completedChallenge";
var acceptedChallenge = "acceptedChallenge";
var votes = "votes";

var app = express();
app.use(express.static(__dirname + "/public"));
//app.use(bodyParser.json());
// hack for images
//TODO: This limit needs to be brought down, probably to 15 mb
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

  // Initialize Database, provide constraints

  // Enforce uniqueness among usernames
  db.collection(userTable).createIndex( { "username": 1 }, { unique: true } );

  // pass database to other files
  user.init(db);
  friends.init(db);
  challenges.init(db);
  utilities.init(db);
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// BEGIN API METHODS

app.get("/", function(req,res) {
  var welcomeMessage = "You found our app!";
  res.writeHeader(200, { 'Content-Type': 'text/html' });
  res.write(welcomeMessage);
});

// Utility Methods


// test API for userExists

app.post("/checkUser", function(req, res){
  db.collection(userTable).findOne( {'username': req.body.username }).then( (user) => {
    res.status(201).json({
      exists: Boolean(user)
    });
  });
});

app.post("/login", (req, res) => {
  db.collection(userTable).findOne({"username": req.body.username, "password": req.body.password}).then( (user) => {
    res.status(201).json( {
      "login": Boolean(user),
      "username": user ? user.username : "",
      "firstname": user ? user.firstName : "",
      "lastname": user ? user.lastName : "",
      "cred": user ? user.cred : 0
    });
  }).catch( (err) => {
    console.log(err);
    handleError(res,"Error in login", "User login messed up");
  })
});


// Routes Table
// Users
 app.post('/addUser', user.addUser);
 app.post("/updateUser", user.updateUser);
 app.post("/addProfPic", user.addProfPic);
 app.post("/getUserInfo", user.getUserInfo);
// Friends
 app.post("/addFriendRequest", friends.addFriendRequest);
 app.post("/deleteFriendRequest", friends.deleteFriendRequest);
 app.post("/addFriend", friends.addFriend);
 app.post("/removeFriend", friends.removeFriend);
 app.post("/getFriends", friends.getFriends);
 app.post("/getFriendRequests", friends.getFriendRequests);
 app.post("/searchFriends", friends.searchFriends);
 app.post("/getFriendsFeed", friends.getFriendsFeed);
 // Challenges
app.post("/getChallengeInfo", challenges.getChallengeInfo);
app.post("/getUserCompletedChallenges", challenges.getUserCompletedChallenges);
app.post("/postGlobalOdds", challenges.postGlobalChallenge);
app.get("/getGlobalOdds", challenges.getGlobalChallenges);
app.post("/acceptedChallenge", challenges.acceptedChallenge);
app.post("/getAcceptedChallenges", challenges.getAcceptedChallenges);
app.post("/failedChallenge", challenges.failedChallenge);
app.post("/deleteFailedChallenges", challenges.deleteFailedChallenges);
app.post("/personalChallenge", challenges.personalChallenge);
app.post("/respondPersonalChallenge", challenges.respondPersonalChallenge);
app.post("/getPendingChallenges", challenges.getPendingChallenges);
app.post("/postCompletedChallenge", challenges.postCompletedChallenge);
app.get("/getCompletedChallenges", challenges.getCompletedChallengesGeneral);
app.post("/getCompletedChallenges", challenges.getCompletedChallenges);
// Utilities
app.post("/addCred", utilities.addCred);
app.post("/updateCred", utilities.updateCred);
