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
import Homepage from './page/Homepage'

// require('dotenv').config();



function App() {
  function handleNavChange (location)  {
    console.log(location);
  }
  

  return (
    // <div className="main-container container-fluid"  >

      <BrowserRouter>
        {/* <Nav className="container-fluid row header" onSubmitInput={handleSubredditChange}/> */}
        <Routes>
          <Route path="/" element={<Homepage/>} exact />
          <Route path="/permission-url"  element={<Consent/>} exact />
          {/* <Route path="/r/:contentType/:contentName"  element={<Page/>} /> */}
          <Route path="/r/:pageName/:pageType"  element={<Page/>} />
          <Route path="/demo/r/:pageName/:pageType"  element={<Page/>} />


        
      </Routes>
     </BrowserRouter>
     
      
    // </div>
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
