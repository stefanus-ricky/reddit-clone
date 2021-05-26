/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback} from 'react';
// import axios from 'axios';
import snoowrap from 'snoowrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas, faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Page from './component/Page'

require('dotenv').config();
library.add(fab, fas, faCheckSquare, faCoffee);



const r = new snoowrap({
  userAgent: 'NewReddit/1.0 by Quarrantine',
  clientId: process.env.REACT_APP_REDDIT_ID,
  clientSecret: process.env.REACT_APP_REDDIT_SECRET,
  refreshToken: process.env.REACT_APP_REFRESH_TOKEN
});
// console.log(this.match.params)
// this.props.location.pathname

// const test =  r.getSubmission('2np694').comment;


function App() {
  function handleNavChange (location)  {
    console.log(location);
  }
  

  return (
    <div className="main-container container-fluid"  >

      <Router>
        <Switch>
          <Route path="/" component={Page} exact />
          <Route path="/:contentType/:contentName"  component={Page}>

          </Route>
      </Switch>
     </Router>
     
      
    </div>
  );
}
//<SubChange />

// function SubChange() {
//   // We can use the `useParams` hook here to access
//   // the dynamic pieces of the URL.
//   let { id, contentType } = useParams();
//   subredditName = id;
//   console.log({subredditName, contentType})
//   return 
// }

/*

<div className="container-fluid row justify-content-center">
        <div className="row">
          Header
        </div>
        <div className="row">
          Subreddit title
        </div>
        <div className="row post-list-container">
          <PostList content={content} click={setContent} ref={lastPostElement}/>
        </div>
        
      </div>

*/

const SAMPLE_CONTENT = [
  {
    id:"1",
    title: "Loading post, please waiting",
    media: "media", 
    created_utc: Date.now()
  }, 
  {
    id:"2",
    title: "Loading post, please waiting",
    media: "image source2",
    created_utc: Date.now()
  } 
];

// const SAMPLE_CONTENT3 = [
//   {
//     id:1,
//     title: "this is title33333333333333",
//     media: "media"
//   }, 
//   {
//     id:2,
//     title: "this is title2",
//     media: "image source2"
//   } 
// ];
// axios.get('link')
// .then(res=> {
//   res.map()
// })

// async function getAuthCode() {
//   try {
//     const response =
    //  await axios.post("https://www.reddit.com/api/v1/access_token", {
    //     //data
    //     "grant_type": "https://oauth.reddit.com/grants/installed_client&/",
    //     "device_id": "0123456789012345678901234"
    //  }, {
  //   auth: {
  //     username: REDDIT_ID,
  //     password: REDDIT_SECRET
  //   }
  // });


//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }



export default App;
