const express = require('express');
const axios = require('axios');
// const Buffer = require('node:buffer');

const router = express.Router();
// import { getItem, putItem } from "../db/dbConfig";
const  { getItem, putItem }  = require("../db/dbConfig");

async function getAccessTokenFromCode(code) {
    // console.log(code)
    const lastChar = code[code.length-1]
    const lastChar2 = code[code.length-2]
    if(lastChar === "_" && lastChar2 === "#") {
        // redirect will add _# to the code, have to cut last two char
        code = code.slice(0, code.length-3)
    }
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
        res.send({access_token})
    } else {
        res.status(500).send(err);
    }
  }

  
});



module.exports = router;
