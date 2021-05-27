/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback} from 'react';
// import axios from 'axios';
import snoowrap from 'snoowrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Page from './component/Page'

require('dotenv').config();

const r = new snoowrap({
  userAgent: 'NewReddit/1.0 by Quarrantine',
  clientId: process.env.REACT_APP_REDDIT_ID,
  clientSecret: process.env.REACT_APP_REDDIT_SECRET,
  refreshToken: process.env.REACT_APP_REFRESH_TOKEN
});

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




export default App;
