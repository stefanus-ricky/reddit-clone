import React from 'react'
import Post from './Post';
import propTypes from 'prop-types';

export default function PostList({content}) {
    if(!content) {
        console.log(`content is null`)
        return null
    }

    return (
        <div>
            {content.map( (item)=>{
                return <Post key={item.id} content={item}/>
                //<div key={item.id}>{item.title} </div>
            })}
        </div>
    )
}

PostList.propTypes = {
    id: Number,
    content: propTypes.array,
    title: propTypes.string,
    media: propTypes.string
}