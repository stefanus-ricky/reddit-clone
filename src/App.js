/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback} from 'react';
// import axios from 'axios';
import Nav from './component/Nav';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Page from './component/Page'
require('dotenv').config();



function App() {
  function handleNavChange (location)  {
    console.log(location);
  }
  

  return (
    <div className="main-container container-fluid"  >

      <Router>
        {/* <Nav className="container-fluid row header" onSubmitInput={handleSubredditChange}/> */}
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
