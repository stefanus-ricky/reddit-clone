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


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.body);
    const {subredditName, options} = req.body;

    r.getTop(subredditName, {options})
        .then( (data) => {
            console.log("requesting data")
            console.log({data})
            res.send(data);
        }
    )

    // res.render('index', { title: 'API' });
});

module.exports = router;
