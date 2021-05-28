import React from 'react'
import Post from './Post';
import propTypes from 'prop-types';

export default function PostList({content, ref}) {
    if(!content) {
        console.log(`content is null`)
        return null
    }

    return (
        <div>
            {content.map( (post, index)=>{
                if(index === content.length-1) return  <Post key={post.id} content={post} ref={ref}  />
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
    ref: propTypes.any
}