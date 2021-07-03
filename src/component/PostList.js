import React from 'react'
import Post from './Post';
import propTypes from 'prop-types';

export default function PostList({content, refs}) {
    if(!content) {
        return null
    }

    return (
        <div className="mx-2 flex">
            {content.map( (post, index)=>{
                if(index === content.length-1) return  <Post key={post.id} content={post} refs={refs}  />
                return <Post key={post.id} content={post}  />
                //<div key={item.id}>{item.title} </div>
            })}
        </div>
    )
}

PostList.propTypes = {
    id: Number,
    content: propTypes.array,
    title: propTypes.string,
    media: propTypes.string,
    refs: propTypes.any
}