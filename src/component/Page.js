/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useContext} from 'react';
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
const SUBMISSION_LIMIT = parseInt(process.env.REACT_APP_SUBMISSION_LIMIT) || 10;
const LOAD_MORE_COUNT = parseInt(process.env.REACT_APP_LOAD_MORE_COUNT) || 10;


export default function Page() {
    const [content, setContent]= useState([]);
    const [isLoading, setIsLoading]= useState(true);
    const [pageNum, setPageNum]= useState(1);
    let { pageType, contentName } = useParams();
    // t = day| week| year
    let submissionRequestDuration = 'week';
    // submissionRequestType = new | hot | top
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
      setIsLoading(true);
      let apiAddress = process.env.REACT_APP_REDDIT_API_ADDRESS || "http://localhost:55050/api";
      // let apiAdress = "localhost:" + process.env.EXPRESS_PORT_USED + "/api"
      // console.debug({ apiAdress: apiAddress, a:process.env.REACT_APP_EXPRESS_PORT_USED})

      let bodyParams = {
        token:"empty",
        contentType: "getTop",
        subredditName: subredditName,
        options: {
          t:submissionRequestDuration, 
          limit: SUBMISSION_LIMIT
        }
      };

      if(pageNum>1) {
        bodyParams.options.after = "t3_" + lastPostId.current;
      }
      // const fetchdata = await fetch("localhost", {
      // console.debug({bodyParams, pageNum, lastPostId})
      fetch(apiAddress, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bodyParams)
      })
      .then((data) => data.json()
      .then( (fetchdata) =>{
        // console.debug({fetchdata})
        setContent(previousData => previousData.concat(fetchdata))
        setIsLoading(false)
      }))
      .catch((e)=>{
        console.log(e)
      });

      /*

      */
    },[subredditName, pageNum]);

    
    
    // allow navigate to other subreddit via search bar
    function handleSubredditChange (subName)  {
      setSubredditName(subName);
      setContent([]);
      setPageNum(1);
    }

    // infinite scroll observer
    const scrollObserver = useRef();
    let lastPostId= useRef();

    const infiniteScrollRef = useCallback((component)=>{
      if(isLoading) return;
      // console.log("page ref")
      // console.log({component, isLoading, id:component?.id})
      if (scrollObserver.current) {
        scrollObserver.current.disconnect()
      }
      scrollObserver.current = new IntersectionObserver( lastPost => {
        if(lastPost[0].isIntersecting){
          loadMore(lastPostId)
          setPageNum( pageNum+1)
        }
      })
      if (component) {
        scrollObserver.current.observe(component);
        lastPostId.current = component.id
        // console.log({componentid:component?.id})
      }  
    }, [isLoading])

    function loadMore(lastPostId) {
      // console.log(`load more is triggered`);
      // console.log(`loading more from `, lastPostId)
    }

    return (
      <div className="container-fluid justify-content-center page-container">       
        <Nav className="container-fluid row header" onSubmitInput={handleSubredditChange}/>
        <div className="row px-4 mb-5">
          This page takes data from Reddit API and populate it with recent data <br/>
          <br/>
          Change the url into r/[subreddit name] or put [subreddit name] at searchbar and click enter
        </div>

        <div className="row px-4 mb-4">
          Subreddit name : {subredditName} 
        </div>

        <div className="row post-list-container px-4">
          <PostList content={content} infiniteScrollRef={infiniteScrollRef}  />
        </div>
      
    </div>
    )
} 
  
