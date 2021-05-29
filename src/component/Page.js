/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import PostList from './PostList';
import snoowrap from 'snoowrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas, faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
import Nav from './Nav';

library.add(fab, fas, faCheckSquare, faCoffee);
// credential for login into reddit API OAuth2 
const r = new snoowrap({
    userAgent: 'NewReddit/1.0 by Quarrantine',
    clientId: process.env.REACT_APP_REDDIT_ID,
    clientSecret: process.env.REACT_APP_REDDIT_SECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN
});

const SUBMISSION_LIMIT = 10;
const LOAD_MORE_COUNT = 10;
let SAMPLE_CONTENT2;

function cbData (data){
    SAMPLE_CONTENT2 =  data.map((arr) => {
      return {
        id: arr.comments
      }
    });
    // title, thumbnail, author, created utc, url, ups,num_comments permalink
    console.log({SAMPLE_CONTENT2})
    console.log({data});
    return data
  }


export default function Page() {
    const [content, setContent]= useState();
    const [isLoading, setIsLoading]= useState(false);
    const [pageNum, setPageNum]= useState(0);
    let { contentType, contentName } = useParams();
    // t= day, week, year
    let submissionRequestDuration = 'week';
    // new, hot, top
    let submissionRequestType = 'top';

    console.log({contentType, contentName })
    if(!contentName) {
      if (!contentType){
        contentType = contentType? contentType: "r";
        contentName = contentName? contentName: "programming";
      } else {
        contentName = contentType;
      }
    }
    const [subredditName, setSubredditName]= useState(contentName);

    // setSubredditName(contentName);
    // console.log({contentType, contentName })

    // fetch data from reddit API. Currently it take "top" submission with "week" range
    useEffect(() => {
      // console.log(`loading is ${isLoading}`)
      // if(isLoading) return
      setIsLoading(true);
      // console.log({subredditName})

      r.getTop(subredditName, {t:submissionRequestDuration, limit: SUBMISSION_LIMIT})
        .then(cbData)
        .then((data)=>{
            setContent(data);
            console.log(data);
        })
        .catch( (e) => {
          console.log(e)
          console.log(`error at submission`)
        })
        
    },[subredditName]);


    // allow navigate to other subreddit via search bar
    function handleSubredditChange (subName)  {
      console.log({subName})
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
          console.log("trigger the infinite scroll");
        }
      })
      if (e) {
        scrollObserver.current.observe(e);
      }  
    }, [isLoading])



    return (
      <div className="container-fluid row justify-content-center">       
        <Nav className="container-fluid row header" onSubmitInput={handleSubredditChange}/>
        <div className="row">
          Change the url into r/[subreddit name] or use searchbar 
        </div>

        <div className="row">
          Subreddit name : {subredditName}
        </div>

        <div className="row post-list-container">
          <PostList content={content} ref={lastPostElement} />
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
  
