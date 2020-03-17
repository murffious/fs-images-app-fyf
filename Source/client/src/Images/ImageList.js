import React from 'react';
import Image from "./Image";
import AddImageForm from "./AddImage.js"
import { withContext } from "../AppContext";

function ImageList(props) {
    const Images = props.images.map(image => {
        return (
            <Image
                key={image._id}
                image={image}
                editImage={props.editImage}
                deleteImage={props.deleteImage}
            />
        )
    })

    return (
        <main>
            <AddImageForm addImage={props.addImage} />
            {Images}
        </main>
    )
}

export default withContext(ImageList);
