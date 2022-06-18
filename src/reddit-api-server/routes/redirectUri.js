const express = require('express');
const axios = require('axios');
const Buffer = require('node:buffer');

const router = express.Router();
// import { getItem, putItem } from "../db/dbConfig";
const  { getItem, putItem }  = require("../db/dbConfig");

async function getAccessTokenFromCode(code) {
    console.log(code)
    if(code[code.length-1] === "_" ) {
        code.splice(1,1,1)
    }
    //   let bodyParams = {
    //     user:process.env.REDDIT_ID,
    //     password: process.env.REDDIT_SECRET
    //   };
    let bodyParams = new URLSearchParams({
        grant_type:"authorization_code",
        code: code,
        redirect_uri: "http://localhost:55050/redirect-uri",
      });
      const requestAddress = "https://www.reddit.com/api/v1/access_token"
      const auth = 'Basic ' + Buffer.from(process.env.REDDIT_ID + ':' + process.env.REDDIT_SECRET).toString('base64') //
      console.log({auth})
      try{
        const response = await axios({
          url: requestAddress,
          method: "POST",
          headers: {
              // "Content-Type": 'application/json',
              // "Accept": 'application/json',
              // "Content-Type": 'application/x-www-form-urlencoded',
              "Authorization": auth,
              // 'User-Agent': 'FilterForReddit /2.0 by Quarrantine',
          },
          data: bodyParams
        })
        console.log({response})
        // console.log({data:response.data})
        return [response, null]
      } catch(err) {
        console.error(err)
        return [null, err]
      }
    
}

/* Handle Authorization code redirect */
router.get('/', async function(req, res, next) {
  console.log("req redir url")
  console.log(req.query)
  const {code, state } = req.query
  console.log({code, state});

  // 
//   const item = await getItem({tableName: "reddit-state", key: {state}})
//   console.log({item})
  // save code? and use it to get token
  if(code){
    const [access_token, err] = await getAccessTokenFromCode("nnsGGmPJAeRRyppPY3JYczDpCEpcyQ#_")
    // TODO: save access token
    console.log({access_token, err})

    if(access_token) {
        res.send(access_token)
    } else {
        res.send(err);
    }
  }

  
});


/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(`post redir`)
  console.log(req.query)
//   res.send('respond with a resource');
});


module.exports = router;
