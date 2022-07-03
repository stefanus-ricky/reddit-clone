/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useContext} from 'react';
import PostList from './PostList';
import {
  useSearchParams,
  useParams,
  useNavigate
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
    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();


    const [content, setContent]= useState([]);
    const [isLoading, setIsLoading]= useState(true);
    const [pageNum, setPageNum]= useState(1);
    const [subredditInfo, setSubredditInfo] = useState();
    // t = day| week| year
    const [timeRange, setTimeRange]= useState(searchParams.get("t") || "week");
    const [requestOptions, setRequestOptions]= useState({});
    
    // r/pageName/pageType?t=day
    // pageType = new | hot | top
    const { pageName, pageType } = useParams();
    const [subredditName, setSubredditName]= useState(pageName);

    const [errorMessage, setErrorMessage]= useState("");
    
    // setSubredditName(contentName);

    
    // fetch more data from same page
    useEffect(() => {
      setIsLoading(true);
      addMoreData();
    },[pageNum]);

    // delete current data everytime different page loaded
    useEffect(() => {
      setIsLoading(true);
      resetPage();

      addMoreData();
    },[subredditName, timeRange, pageType]);
    
    // allow navigate to other subreddit via search bar
    function handleSubredditChange (subName)  {
      navigate(`/demo/r/${subName}/${pageType}?t=${timeRange}`)
      resetPage();
    }
    function handlePageTypeChange(type)  {
      navigate(`/demo/r/${subredditName}/${type}?t=${timeRange}`)
      resetPage();
    }

    // infinite scroll observer
    const scrollObserver = useRef();
    let lastPostId= useRef();

    const infiniteScrollRef = useCallback((component)=>{
      if(isLoading) return;
      
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
      }  
    }, [isLoading])

    async function addMoreData () {
      setIsLoading(true);
      let apiAddress = process.env.REACT_APP_REDDIT_API_ADDRESS || "http://localhost:55050/api";
      // console.log({apiAddress})
      // let apiAdress = "localhost:" + process.env.EXPRESS_PORT_USED + "/api"
      // console.debug({ apiAdress: apiAddress, a:process.env.REACT_APP_EXPRESS_PORT_USED})

      let bodyParams = {
        token:"empty",
        contentType: "getPage",
        subredditName: subredditName,
        sort:pageType,
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
        if(response.statusText === "OK" || response.status >= 200 && response.status < 300) {
          const fetchdata = response.data
          console.debug({fetchdata})
          setContent(previousData => previousData.concat(fetchdata))
          setIsLoading(false)
        } else {
          console.error(response)
          setIsLoading(false)
        }
      } catch (e){
        console.error(e);
        console.error(e.response.data);
        setIsLoading(false)
      }
    }

    function resetPage() {
      setContent([]);
      setPageNum(1);
    }

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
          Sort type : {pageType} 
          <div>
            <button type="button" className='flex btn-sm btn-primary m-1 ' onClick={()=>handlePageTypeChange("new")}
              >
                New
            </button>
            <button type="button" className='flex btn-sm btn-primary m-1 ' onClick={()=>handlePageTypeChange("hot")}
              >
                Hot
            </button>
            <button type="button" className='flex btn-sm btn-primary m-1 ' onClick={()=>handlePageTypeChange("top")}
              >
                Top
            </button>
            <button type="button" className='flex btn-sm btn-primary m-1 ' onClick={()=>handlePageTypeChange("controversial")}
              >
                Controversial
            </button>
          </div>
        </div>
        <div className="row px-4 mb-4">
          Time range: {timeRange} 
          <div>
            <button type="button" className='flex btn-sm btn-primary m-1 ' onClick={()=>setTimeRange("day")}
              >
                Day
            </button>
            <button type="button" className='flex btn-sm btn-primary m-1' onClick={()=>setTimeRange("week")}
              >
                Week
            </button>
            <button type="button" className='flex btn-sm btn-primary m-1' onClick={()=>setTimeRange("month")}
              >
                Month
            </button>
            <button type="button" className='flex btn-sm btn-primary m-1' onClick={()=>setTimeRange("year")}
              >
                Year
            </button>
            <button type="button" className='flex btn-sm btn-primary m-1' onClick={()=>setTimeRange("all")}
              >
                All time
            </button>
          </div>
          
        </div>
        {errorMessage? "Error:" + errorMessage : null}
        {/* 
        */}
        <div className="col-md-10 col-xl-10 col-xxl-9 post-list-container px-4">
          <PostList content={content} infiniteScrollRef={infiniteScrollRef}  />
        </div>
      
    </div>
    )
} 
  
