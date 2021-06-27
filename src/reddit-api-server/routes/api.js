var snoowrap = require('snoowrap')
var express = require('express');
var router = express.Router();

console.log('printing environment var')
console.log(process.env.REACT_APP_REDDIT_ID)

const r = new snoowrap({
    userAgent: 'NewReddit/1.0 by Quarrantine',
    clientId: process.env.REACT_APP_REDDIT_ID,
    clientSecret: process.env.REACT_APP_REDDIT_SECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN
});

function postAndGet (req,res,next) {
    console.debug({reqbody: req.body});
    const {subredditName, options, contentType, contentId} = req.body;

    console.debug({subredditName, options, contentType, contentId});
    console.debug(contentType == "comment")
    
    
    // if(contentType == "comment"){
    //     r.getSubmission(contentId).expandReplies(options)
    //     .then((data)=> {
    //         // console.log({comments: c.comments});
    //         console.log("requesting comments data")
    //         res.send(data);
    //     })
    //     .catch( (e) => {
    //         console.log(e)
    //         console.log(`error at comments`)
    //       })  
    // } else {
    //     r.getTop(subredditName, {options})
    //         .then( (data) => {
    //             console.log("requesting post data")
    //             // console.log({data})
    //             res.send(data);
    //         }
    //     )
    // }

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
                // console.debug("requesting post data")
                let data = await r.getTop(subredditName, options)
                // console.debug({data})
                res.send(data);
              })();
            
            break;
        case "getSubredditInfo":
            (async function () {
                console.log("requesting post data")
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
