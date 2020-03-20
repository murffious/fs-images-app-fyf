import React from 'react';
// import Image from "./Image";
import AddImageForm from "./AddImage.js"
import { withContext } from "../AppContext";
// import Upload from './Upload';
// import ImageCard from './ImageCard';
import ImageGrid  from './ImageGrid';

function ImageList(props) {
    console.log("Image List")
    // const Images = props.images.map(image => {
    //     return (
    //         <ImageCard
    //             key={image.id}
    //             image={image}
    //             editImage={props.editImage}
    //             deleteImage={props.deleteImage}
    //         />
    //     )
    // })

    return (
        <main>
            <AddImageForm addImage={props.addImage} />
            {/* {Images} */}
            <ImageGrid  {...props}/>
        </main>
    )
}

export default withContext(ImageList);
