import React from 'react'
import propTypes from 'prop-types';

export default function Temp({content}) {
    return (
        <div>
            {content.title}
        </div>
    )
}

Temp.propTypes = {
    id: Number,
    content: propTypes.array,
    title: propTypes.string,
    media: propTypes.string
}