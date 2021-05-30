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
          <Route path="/:contentType/:contentName"  component={Page} />
          <Route path="/:contentName"  component={Page} />

        
      </Switch>
     </Router>
     
      
    </div>
  );
}

/*


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






export default App;
