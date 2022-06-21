/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useContext} from 'react';
import PostList from './PostList';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useSearchParams,
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
    const [subredditInfo, setSubredditInfo] = useState();
    const [timeRange, setTimeRange]= useState("");
    
    // r/pageName/pageType?t=day
    let { pageName, pageType } = useParams();
    const [subredditName, setSubredditName]= useState(pageName);
    
    const [searchParams, setSearchParams] = useSearchParams();
    // t = day| week| year
    let submissionRequestDuration = 'week';
    // pageType = new | hot | top
    let submissionRequestType = 'top';



    // setSubredditName(contentName);

    useEffect (()=>{
      if(!pageName){
        pageName = pageName? pageName: "programming";
      }
      if(!pageType){
        pageType = pageType? pageType: "programming";
      }
      const t = searchParams.get("t")
      console.log({t})
      if(t){
        setTimeRange(t)
      } else {
        setTimeRange("day")
      }
      console.debug({t, pageName, pageType})
      

    }, [])

    // fetch data from reddit API. Currently it take "top" submission with "week" range
    useEffect(() => {
      if(!timeRange) {
        return
      }
      setIsLoading(true);
      addMoreData();
    },[subredditName, pageNum, timeRange]);

    async function addMoreData () {
      let apiAddress = process.env.REACT_APP_REDDIT_API_ADDRESS || "http://localhost:55050/api";
      // console.log({apiAddress})
      // let apiAdress = "localhost:" + process.env.EXPRESS_PORT_USED + "/api"
      // console.debug({ apiAdress: apiAddress, a:process.env.REACT_APP_EXPRESS_PORT_USED})

      let bodyParams = {
        token:"empty",
        contentType: "getTop",
        subredditName: subredditName,
        options: {
          t:timeRange, 
          limit: SUBMISSION_LIMIT
        }
      };

      if(pageNum>1) {
        bodyParams.options.after = "t3_" + lastPostId.current;
      }
      console.debug({bodyParams})

      try{
        const response = await axios({
          url: apiAddress,
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: JSON.stringify(bodyParams),
          // withCredentials:true
        })
        if(response.statusText === "OK") {
          const fetchdata = response.data
          console.debug({fetchdata})
          setContent(previousData => previousData.concat(fetchdata))
          setIsLoading(false)
        } else {
          console.error(response)
        }
      } catch (e){
        console.error(e);
        console.error(e.response.data);
      }
    }

    
    
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
    function handleSubmit(e){

      // let params = new URLSearchParams(e.target);
      // setSearchParams(params);
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
        <div className="row px-4 mb-4">
          Time range: {timeRange}
        </div>
        {/* 
        */}
        <div className="col-md-10 col-xl-10 col-xxl-9 post-list-container px-4">
          <PostList content={content} infiniteScrollRef={infiniteScrollRef}  />
        </div>
      
    </div>
    )
} 
  
