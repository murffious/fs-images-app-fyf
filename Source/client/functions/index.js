const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
// // Create and Deploy Your Cloud Functions

const projectId = functions.config().imageservice.id

let gcs = new Storage ({
    projectId
});
    
exports.onFileChange = functions.storage.object().onFinalize(event => {
    // const object = event.bucket;
    const bucket = event.bucket;
    const contentType = event.contentType;
    const filePath = event.name;
    console.log('File change detected, function execution started');

    if (event.resourceState === 'not_exists') {
        console.log('We deleted a file, exit...');
        return;
    }

    if (path.basename(filePath).startsWith('resized-')) {
        console.log('We already renamed that file!');
        return;
    }

    const destBucket = gcs.bucket(bucket);
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = { contentType: contentType };
    return destBucket.file(filePath).download({
        destination: tmpFilePath
    }).then(() => {
        return spawn('convert', [tmpFilePath, '-resize', '500x500', tmpFilePath]);
    }).then(() => {
        return destBucket.upload(tmpFilePath, {
            destination: 'resized-' + path.basename(filePath),
            metadata: metadata
        })
    });
});
