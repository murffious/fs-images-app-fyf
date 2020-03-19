const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// Error: "onChange" is now deprecated, please use "onArchive", "onDelete", "onFinalize", or "onMetadataUpdate".
// This will run any time you upload a file to your GCS bucket
exports.imageAdded = functions.storage.object().onArchive(event => {

    const object = event.data;
    const filePath = object.name;
    const contentType = object.contentType;
    const resourceState = object.resourceState;

    // Only continue if this is an image
    if (!contentType.startsWith('image/')) {
        return;
    }
    // Exit if this is a move or deletion event.
    if (resourceState === 'not_exists') {
        return;
    }

    console.log(filePath + ' was uploaded');
    // YOUR CLOUDINARY UPLOAD CODE WILL GO HERE... read on
});