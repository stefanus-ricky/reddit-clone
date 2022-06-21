/* eslint-disable no-unused-vars */
import React, {useCallback} from 'react'
import Post from './Post';
import propTypes from 'prop-types';

export default function PostList({content, infiniteScrollRef}) {
    if(!content) {
        return null
    }
    return (
        <div className="mx-2 flex">
            {content.map( (post, index)=>{
                if(index === content.length-1) {
                    return  <Post key={post.id + "_" + index} content={post} infiniteScrollRef={infiniteScrollRef} />
                }
                    return <Post key={post.id + "_" + index}  content={post}  />
            })}
        </div>
    )
}

PostList.propTypes = {
    id: Number,
    content: propTypes.array,
    title: propTypes.string,
    media: propTypes.string,
    infiniteScrollRef:propTypes.any,
}