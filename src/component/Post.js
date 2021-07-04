/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useCallback} from 'react'
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactHlsPlayer from 'react-hls-player';
import timeago from 'epoch-timeago';


const COMMENT_LIMIT = 1;
const COMMENT_DEPTH = 1;
const COMMENT_COUNT = 5;


function Media(props) {
    const isVideo = props.isVideo;
    /* 
    
 
*/
    if (isVideo) {    
        if(!props.content.is_reddit_media_domain) return <a href={props.src.fallback_url}>{props.src.fallback_url}</a>
        return (

            <ReactHlsPlayer
                src= {props.src.hls_url}
                autoPlay={false}
                controls={true}
                width="100%"
                height="auto"
                hlsConfig={{
                    maxBufferLength:30,
                    maxBufferSize: 15,
                    chunkDurationTarget: 12000
                  }}
            />
            
        
        )  
    }  
    if(!props.content.is_reddit_media_domain) return <a href={props.content.url} target="_blank" rel="noreferrer">{props.content.url}</a>
    return <img className="media-img" loop="" muted=""  alt="images" src={props.src}></img>;
}



/*
    Change upvote format into one decimal place 10.1 k or 3.5m
*/
const convertUpvote = (vote ) => {
    
    if (vote > 1000000)     return (vote /1000000).toFixed(1) + " m"
    if (vote > 1000)        return (vote/1000).toFixed(1) + " k"
    return vote
}

const TimeAgo = ({ time }) => <time dateTime={new Date(time).toISOString()}>{timeago(time)}</time>


export default function Post({content, infiniteScrollRef}) {
    const [commentList, setCommentList] = useState([]);
    // fetch comment
    useEffect(() => {
        // console.log("fetch comment")
        // console.log(content.id)
      let apiAddress = process.env.REACT_APP_REDDIT_API_ADDRESS || "http://localhost:55050/api";
      let bodyParams = {
        contentType: "getComment",
        contentId: content.id,
        options: {
            limit:COMMENT_LIMIT, 
            depth: COMMENT_DEPTH
        }
      };
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
        // console.log({fetchdata})
        setCommentList(fetchdata);
      }));


      /* deprecated snoowrap
      r.getSubmission(content.id).expandReplies({limit:COMMENT_LIMIT, depth: COMMENT_DEPTH})
      .then((c)=> {
          // console.log({comments: c.comments});
          setCommentList(c);
      })
      .catch( (e) => {
          console.log(e)
          console.log(`error at comments`)
        })  


      */
    }, [])
  
    return (
        
        <div className="container-fluid row  content-post">
            {/**
             *  
             * Votes
             * 
             * */}

            <div className="col d-none d-sm-flex vote-container ">
                <FontAwesomeIcon className="arrow-icon upvote" icon={["fas", "arrow-alt-circle-up"]} />
                <div className="row vote-num ps-1 pe-1">
                    {convertUpvote(content.ups)}
                </div>
                <FontAwesomeIcon className="arrow-icon downvote" icon={["fas", "arrow-alt-circle-down"]} />
            </div>


            {/**
             *  
             * Post container
             * 
             * */}
            <div className="col col-12 col-md-9 col-xl-6 col-xxl-6 post-container m-1 me-0" ref={infiniteScrollRef} id={content.id}  > 
                
                <div className="container-fluid row ">
                    {
                    //Line 1  [Posted by u/username] [5 hours ago] [whatever spam emoji] 
                    }
                    Posted by u/{content.author} <TimeAgo time={content.created_utc* 1000}/> 
                
                </div>
                <div className="container-fluid row  content-title">
                    {
                    //Line 2 [Title] [flair]
                    }
                    {content.title}
                
                </div>
                <div className="container-fluid  content-media row ">
                    {
                    //Line 3  Media [Image] 
                    }
                    <Media 
                    content={content} 
                    isVideo={content.is_video} 
                    src={content.secure_media?content.secure_media.reddit_video: content.url} 
                    id={content.id}/>
                </div>
                <div className="row container-fluid">
                    <div className="col d-flex d-sm-none vote-container-small">
                        <FontAwesomeIcon className="arrow-icon upvote vote-small" icon={["fas", "arrow-alt-circle-up"]} />
                        <div className="vote-num ps-1 pe-1" >
                            {convertUpvote(content.ups)}
                        </div>
                        <FontAwesomeIcon className="arrow-icon downvote vote-small" icon={["fas", "arrow-alt-circle-down"]} />
                    </div>
                    
                
                    <div className=" col ">
                        {
                        // Line 4 Nav: Comment, share
                        }
                        {convertUpvote(content.num_comments)} comments
                    
                    </div>
                </div>
                
            </div>

            {/**
             *  
             * Comment container
             * 
             * */}

            <div className="d-none d-xl-block col-md-3 col-xl-4 col-xxl-4  comment-container">
                Comments <br/> <br/>
                {commentList?.comments?.map(  (comment, index) => {
                    console.log({comment})

                    if(index >= COMMENT_COUNT) return null
                    // last element. add tracker for infinite scroll detection
                    // if(index === commentList.comments.length -1) {
                    //     return (
                    //     <div key={comment.id} className="comment"  > 
                    //     u/{comment.author} 
                    //     <br/> {comment.body} <br/> <br/> 
                    //     </div>
                    //     )}

                    return ( 
                        <div key={comment.id} className="comment"> 
                        u/{comment.author}    
                        <br/> 
                        <TimeAgo time={comment.created_utc* 1000}/>
                        <br/> 
                        {comment.body} <br/> <br/> 
                        </div>
                    ) 
                })}
            </div>
        </div>
    )
}

  // title, thumbnail, author, created_utc, url, ups,num_comments permalink

Post.propTypes = {
    content: propTypes.object,
    media: propTypes.string,
    title: propTypes.string,
    author: propTypes.string,
    created_utc: propTypes.number,
    url: propTypes.string,
    ups: propTypes.number,
    num_comments: propTypes.number,
    is_video:propTypes.bool,
    infiniteScrollRef: propTypes.any,
}
TimeAgo.propTypes= {
    time: propTypes.number
}
Media.propTypes= {
    isVideo: propTypes.bool,
    src: propTypes.any,
    videosrc: propTypes.string,
    content: propTypes.object, 
    url: propTypes.string
}
/*
 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sem ipsum, laoreet sed viverra at, tincidunt a massa. Nunc non odio ultrices, faucibus augue in, imperdiet orci. Vestibulum quis nulla eu turpis pulvinar blandit vitae eleifend ipsum. In vitae ullamcorper mi, id gravida libero. Donec quis dolor at turpis suscipit congue non quis elit. Aliquam vel felis sagittis, ornare elit non, molestie nisl. Sed malesuada odio non erat mattis congue.

Sed nec ullamcorper metus. Aenean ac vulputate est. Donec aliquam sapien pharetra dolor egestas, nec scelerisque nunc accumsan. Nunc pulvinar mollis lectus, et hendrerit orci egestas consectetur. Proin pellentesque lectus interdum volutpat tristique. Nunc varius eleifend elit, dignissim ullamcorper elit congue non. Curabitur hendrerit ex non justo efficitur, ut lobortis mi aliquet. 
*/
