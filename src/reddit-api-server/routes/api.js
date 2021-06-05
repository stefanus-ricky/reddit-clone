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
    console.debug(req.body);
    const {subredditName, options, contentName, contentId} = req.body;

    console.debug({subredditName, options, contentName, contentId});
    // console.debug(contentName == "comment")
    if(contentName == "comment"){
        r.getSubmission(contentId).expandReplies(options)
        .then((data)=> {
            // console.log({comments: c.comments});
            console.log("requesting comments data")
            res.send(data);
        })
        .catch( (e) => {
            console.log(e)
            console.log(`error at comments`)
          })  
    } else {
        r.getTop(subredditName, {options})
            .then( (data) => {
                console.log("requesting post data")
                // console.log({data})
                res.send(data);
            }
        )
    }
}

/* GET home page. */
router.post('/', postAndGet)
router.get('/', postAndGet)


module.exports = router;
