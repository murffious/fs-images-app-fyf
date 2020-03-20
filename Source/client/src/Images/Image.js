import React from 'react';

function Image(props) {
    return (
        <div>
            <h3>{props.image.id}</h3>
            <label>Image:</label>
            <input
                onChange={() => props.editImage(props.image.id, { completed: !props.image.completed })}
                type="checkbox"
                checked={props.image.completed}/>
            <button onClick={() => props.deleteImage(props.image.id)}>X</button>
        </div>
    )
}

export default Image;
