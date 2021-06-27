/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import PostList from './PostList';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas, faCheckSquare, faCoffee, faHotdog } from '@fortawesome/free-solid-svg-icons';
import Nav from './Nav';
import axios from 'axios';

library.add(fab, fas, faCheckSquare, faCoffee);
// credential for login into reddit API OAuth2 


// const fd = new FormData();
// fd.append("code", code);
// fd.append("grant_type", "authorization_code");
// fd.append("redirect_uri", "your_redirect_uri");


const SUBMISSION_LIMIT = parseInt(process.env.REACT_APP_SUBMISSION_LIMIT) || 10;
const LOAD_MORE_COUNT = parseInt(process.env.REACT_APP_LOAD_MORE_COUNT) || 10;
let SAMPLE_CONTENT2;
console.log(SUBMISSION_LIMIT, " env is ", process.env.REACT_APP_SUBMISSION_LIMIT)

function cbData (data){
    SAMPLE_CONTENT2 =  data.map((arr) => {
      return {
        id: arr.comments
      }
    });
    // title, thumbnail, author, created utc, url, ups,num_comments permalink
    // console.log({SAMPLE_CONTENT2})
    // console.log({data});
    return data
  }


export default function Page() {
    const [content, setContent]= useState();
    const [isLoading, setIsLoading]= useState(false);
    const [pageNum, setPageNum]= useState(0);
    let { pageType, contentName } = useParams();
    // t= day, week, year
    let submissionRequestDuration = 'week';
    // new, hot, top
    let submissionRequestType = 'top';
    if(!contentName) {
      if (!pageType){
        pageType = pageType? pageType: "r";
        contentName = contentName? contentName: "programming";
      } else {
        contentName = pageType;
      }
    }
    const [subredditName, setSubredditName]= useState(contentName);

    // setSubredditName(contentName);
    // console.log({pageType, contentName })

    // fetch data from reddit API. Currently it take "top" submission with "week" range
    useEffect(() => {
      // console.log(`loading is ${isLoading}`)
      if(isLoading) return
      setIsLoading(true);
      // console.log({subredditName})

      let apiAddress = process.env.REACT_APP_REDDIT_API_ADDRESS || "http://localhost:55050/api";
      // let apiAdress = "localhost:" + process.env.EXPRESS_PORT_USED + "/api"
      console.log({ apiAdress: apiAddress, a:process.env.REACT_APP_EXPRESS_PORT_USED})

      // const fetchdata = await fetch("localhost", {
      fetch(apiAddress, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token:"empty",
          contentType: "getTop",
          subredditName: subredditName,
          options: {t:submissionRequestDuration, limit: SUBMISSION_LIMIT}
        })
      })
      .then((data) => data.json()
      .then( (fetchdata) =>{
        console.log({fetchdata})
        setContent(fetchdata)
        setIsLoading(false)
      }))
      .catch((e)=>{
        console.log(e)
      });

      /*

      */
    },[subredditName]);

    
    
    // allow navigate to other subreddit via search bar
    function handleSubredditChange (subName)  {
      setSubredditName(subName);
    }

    let lastPostElementRef = useCallback( (e) => {
      console.log(e);
    });


    // infinite scroll observer
    const scrollObserver = useRef();
    const lastPostElement = useCallback((e)=>{
      if(isLoading) return;
      if (scrollObserver) scrollObserver.current.disconnect()
      scrollObserver.current = new IntersectionObserver( lastPost => {
        if(lastPost[0].isIntersecting){
          // console.log("trigger the infinite scroll");
        }
      })
      if (e) {
        scrollObserver.current.observe(e);
      }  
    }, [isLoading])



    return (
      <div className="container-fluid justify-content-center page-container">       
        <Nav className="container-fluid row header" onSubmitInput={handleSubredditChange}/>
        <div className="row px-4 mb-5">
          This page takes data from Reddit API and populate it with recent data <br/>
          <br/>
          Change the url into r/[subreddit name] or put [subreddit name] at searchbar and click enter
        </div>

        <div className="row px-4 ">
          Subreddit name : {subredditName} 
        </div>

        <div className="row post-list-container px-4">
          <PostList content={content} refs={lastPostElement} />
        </div>
      
    </div>
    )
} 

/*

ref={lastPostElement}
      const scrollObserver = useRef();
      const lastPostElement = useCallback((e)=>{
        if(isLoading) return;
        if (scrollObserver) scrollObserver.current.disconnect()
        scrollObserver.current = new IntersectionObserver( lastPost => {
          if(e[0].isIntersecting){
            console.log("trigger the infinite scroll");
          }
    
        })
        if (e) {
          scrollObserver.current.observe(e);
        }
    
      }, [])


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
  
