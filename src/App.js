/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback} from 'react';
// import axios from 'axios';
import Nav from './component/Nav';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Page from './component/Page'
import Consent from './component/Consent'

// require('dotenv').config();



function App() {
  function handleNavChange (location)  {
    console.log(location);
  }
  

  return (
    <div className="main-container container-fluid"  >

      <BrowserRouter>
        {/* <Nav className="container-fluid row header" onSubmitInput={handleSubredditChange}/> */}
        <Routes>
          <Route path="/" component={Page} exact />
          <Route path="/permission-url"  component={Consent} exact />
          <Route path="/r/:contentType/:contentName"  component={Page} />
          <Route path="/r/:contentName"  component={Page} />


        
      </Routes>
     </BrowserRouter>
     
      
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
