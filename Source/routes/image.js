const express = require("express");
const imageRouter = express.Router();
const db = require("../models");
const Multer = require('multer');
const keys = require('../config/keys.js')

  // Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

  // Creates a client
  // Creates a client from a Google service account key.
const storage = new Storage({keyFilename: keys});
const bucket = storage.bucket("gs://images-6efd1.appspot.com");

const multer = Multer({
storage: Multer.memoryStorage(),
limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
}
});


/**
 * Adding new file to the storage
 */
imageRouter.post('/upload', multer.single('file'), (req, res, next) => {
    console.log('Upload Image', req.file);

    let file = req.file;
    if (file) {
    uploadImageToStorage(file).then((success) => {
        res.status(200).send({
        status: 'success'
        });
    }).catch((error) => {
        console.error(error);
    });
    }
});

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
    if (!file) {
        reject('No image file');
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
        metadata: {
        contentType: file.mimetype
        }
    });

    blobStream.on('error', (error) => {
        reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        resolve(url);
    });

    blobStream.end(file.buffer);
    });
}



imageRouter.get("/", (req, res, next) => {

});


imageRouter.get("/:imageId", (req, res, next) => {

});

imageRouter.put("/:imageId", (req, res, next) => {
   
});

imageRouter.delete("/:imageId", (req, res, next) => {
   
});

module.exports = imageRouter;


