var snoowrap = require('snoowrap')
var express = require('express');
var router = express.Router();
require('dotenv').config();

const r = new snoowrap({
    userAgent: 'BetterReddit/2.0 by Quarrantine',
    clientId: process.env.REDDIT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    refreshToken: process.env.DEMO_REFRESH_TOKEN 
});

function postAndGet (req,res,next) {
    console.debug({reqbody: req.body});
    const {subredditName, sort, options, contentType, contentId} = req.body;

    const pageFunctionList = {
        hot: r.getHot,
        top: r.getTop,
        new : r.getNew,
        controversial: r.getControversial
    }
    async function getPage (subredditName, sort, options) {

        const pageFunction = pageFunctionList[sort]
        const pageOption = {
            limit: options.limit,
            time:sort,

        }
        // limit?: number;
        // after?: string;
        // before?: string;
        // show?: string;
        // count?: number;

        try {
            console.log({subredditName, sort, pageOption})
            let data
            switch(sort) {
                case "hot":
                    data = await r.getHot(subredditName, options)
                    break;
                case "top":
                    data = await  r.getTop(subredditName, options)
                    break;
                case "new":
                    data = await  r.getNew(subredditName, options)
                    break;
                case "controversial":
                    data = await  r.getControversial(subredditName, options)
                    break;
            }
            // let data = await r.getHot(subredditName, pageOption)
            res.send(data);
        } catch (e) {
            console.error(e)
            res.status(500).send({message: e})
        }
    }

    async function getTop (subredditName, options) {
        // console.log({subredditName, options})
        try {
            let data = await r.getTop(subredditName, options)
            res.send(data);
        } catch (e) {
            console.error(e)
            res.status(500).send({message: e})
        }
    }




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
            getTop(subredditName, options)
            break;
        case "getPage":
            getPage(subredditName, sort, options)
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
