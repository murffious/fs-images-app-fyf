import React from 'react';

function Image(props) {
    return (
        <div>
            <h3>{props.image.title}</h3>
            <label>Completed:</label>
            <input
                onChange={() => props.editImage(props.image._id, { completed: !props.image.completed })}
                type="checkbox"
                checked={props.image.completed}/>
            <button onClick={() => props.deleteImage(props.image._id)}>X</button>
        </div>
    )
}

export default Image;
