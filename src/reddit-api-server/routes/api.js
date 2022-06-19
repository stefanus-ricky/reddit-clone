var snoowrap = require('snoowrap')
var express = require('express');
var router = express.Router();
require('dotenv').config();

// console.log('printing environment var')
// console.log(process.env.REACT_APP_REDDIT_ID)
// const {REDDIT_ID, REDDIT_SECRET, DEMO_REFRESH_TOKEN} = process.env
// console.log({REDDIT_ID, REDDIT_SECRET, DEMO_REFRESH_TOKEN} )

// let r;
const r = new snoowrap({
    userAgent: 'BetterReddit/2.0 by Quarrantine',
    clientId: process.env.REDDIT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    refreshToken: process.env.DEMO_REFRESH_TOKEN 
});

function postAndGet (req,res,next) {
    // console.debug({reqbody: req.body});
    const {subredditName, options, contentType, contentId} = req.body;


    switch(contentType) {
        case "getComment":
            r.getSubmission(contentId).expandReplies(options)
            .then((data)=> {
                // console.log({comments: c.comments});
                // console.debug("requesting comments data")
                res.send(data);
            })
            .catch( (e) => {
                console.error(e)
                console.error(`error at comments`)
              })  
            break;
        case "getTop":
            (async function () {
                console.debug("requesting getTop data")
                console.debug({reqbody: req.body});
                let data = await r.getTop(subredditName, options)
                // console.debug({data})
                res.send(data);
              })();
            
            break;
        case "getSubredditInfo":
            (async function () {
                console.log("requesting getSubredditInfo data")
                console.debug({reqbody: req.body});
                let subred = await r.getSubreddit(subredditName)
                let title = await subred.title
                let icon = await subred.community_icon
                // console.debug({subred})
                res.send({title,icon});
            })();
            break;
        default:
            res.send(Error (`invalid content name ${contentType}`))
            break;
      } 
}

/* GET home page. */
router.post('/', postAndGet)
router.get('/', postAndGet)


module.exports = router;
