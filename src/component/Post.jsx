/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useCallback} from 'react'
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import ReactHlsPlayer from 'react-hls-player';
import timeago from 'epoch-timeago';
import axios from 'axios';
import ReactPlayer from 'react-player'
import ImageGallery from 'react-image-gallery';

const COMMENT_LIMIT = 1;
const COMMENT_DEPTH = 1;
const COMMENT_COUNT = 5;
const REDDIT_BASE_URL = "https://www.reddit.com/"

function Media(props) {
    const {is_video, permalink, thumbnail, domain, media_embed, media, is_gallery, is_self} = props.content;
 
    const url = props?.src?.hls_url || props.url // || props.url_overridden_by_dest:

    if (is_video || props.isVideo) {    
        // if(!props.content.is_reddit_media_domain) return <a href={props.src.fallback_url}>{props.src.fallback_url}</a>
        return (
            <ReactPlayer 
                url={url}
                controls={true}
                width="100%"
                height="auto"
                config={{
                    youtube: {
                      playerVars: { showinfo: 1 }
                    },
                    file:{
                        hlsOptions:{
                            // autoStartLoad:false,
                        }
                    }
                    // facebook: {
                    //   appId: '12345'
                    // }
                  }}
            />
        )  
    }  
    // TODO: compare iframe vs ReactPlayer youtube. 
    if(domain === "youtube.com") {
        
        return (
            <ReactPlayer 
                url={url}
                controls={true}
                width="100%"
                height="auto"
                config={{
                    youtube: {
                      playerVars: { showinfo: 1 }
                    },
                    file:{
                        hlsOptions:{
                            // autoStartLoad:false,
                        }
                    }
                    // facebook: {
                    //   appId: '12345'
                    // }
                  }}
            />
        )  
        // return (
        // <div  style={{height: media_embed.height, width:media_embed.width}}>
        //     {/* <iframe width="356" height="200" 
        //     src="https://www.youtube.com/embed/oTcuzkiU-XE?feature=oembed&enablejsapi=1" 
        //     frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        //     allowFullScreen 
        //     title="【KARAOKE】💙💛 #amesame"></iframe> */}
        //     <Asd/>
        // </div>
        // )
    }
    // if(props.content.is_reddit_media_domain) {
    //     console.log("reddit domain")
    //     console.log({props})
    //     return <a href={props.content.url} target="_blank" rel="noreferrer">{props.content.url}</a>
    // } 
    if(is_gallery) {
        const metadata = props.content.media_metadata
        let galeryImage= [];
        for (let index in metadata) {
            const val = metadata[index]
            galeryImage.push({original:val.s.u})
        }
        return <>
        <ImageGallery items={galeryImage} />
        </>
    } 
    if(is_self){

        return <div>{props.content.selftext}</div>
    }
    // console.log({props})
    if(props.content.post_hint === "image"){
        return <img className="media-img" loop="" muted=""  alt="images" src={props.src}></img>;
    }
    return <a className='' style ={{textDecoration: 'none'}} href={props.content.url} >
    {props.content.url}
</a>
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


export default function Post(props) {
    const {content, infiniteScrollRef} = props
    const [commentList, setCommentList] = useState([]);
    // fetch comment
    useEffect(() => {
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
             * 
             * */}
            <div className="col col-12 col-sm-10 col-md-9  col-xl-6 col-xxl-6 post-container m-1 me-0" ref={infiniteScrollRef} id={content.id}  > 
                
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
                    <a className='' style ={{textDecoration: 'none'}} href={REDDIT_BASE_URL + content.permalink} >
                        See this post on Reddit
                    </a>
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

            <div className="d-none d-xl-block col-xl-4 col-xxl-3 comment-container">
                Comments <br/> <br/>
                {commentList?.comments?.map(  (comment, index) => {
                    // console.log({comment})
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
