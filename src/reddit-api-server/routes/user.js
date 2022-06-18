var express = require('express');
var router = express.Router();
const  { getItem, putItem }  = require("../db/dbConfig");
const  { ddbDocClient}  = require("../db/dbConfig");



/* GET users listing. */
router.get('/url', function(req, res, next) {
  console.log("permission url")

  const CLIENT_ID = process.env.REDDIT_ID
  const TYPE = "code"
  const STATE =  Math.random().toString(36).substring(8);
  const URI = process.env.REDIRECT_URI
  const DURATION = "permanent" // or temporary
  const SCOPE_STRING = "identity read"  
  // Scope Values: identity, edit, flair, history, modconfig, modflair, modlog, modposts, 
  // modwiki, mysubreddits, privatemessages, read, report, save, submit, subscribe, vote, wikiedit, wikiread.
  
  const url = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${TYPE}&state=${STATE}&redirect_uri=${URI}&duration=${DURATION}&scope=${SCOPE_STRING}`
  console.log({url})
  const item = {
    primaryKey: Date.now(),
    state_id: Date.now(),
    state: STATE,
    user_id: "NOT IMPLEMENTED YET"
  }
  const response = putItem({tableName:"reddit-state", item})
  console.log({response})
  // TODO: save the state to db, used it later for redirect uri
  // getAccessTokenFromCode("nnsGGmPJAeRRyppPY3JYczDpCEpcyQ#_")

  res.send(url);
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(`user`)
  res.send('respond with a resource');
});


module.exports = router;
