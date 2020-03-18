const express = require("express");
const imageRouter = express.Router();
const db = require("../models");
const Multer = require('multer');
const fs = require('fs')
const path = require("path");
const GCP_STORAGE_BUCKET = process.env.GCP_STORAGE_BUCKET

  // Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
  // Creates a client from a Google service account key.
const storage = new Storage({keyFilename: path.join(__dirname, '../config/keys.json')});
const multer = Multer({
storage: Multer.memoryStorage(),
limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
}
});
// give write access etc
var admin = require("firebase-admin");
var serviceAccount = require(path.join(__dirname, '../config/keys.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://images-6efd1.firebaseio.com"
});
const bucket = admin.storage().bucket(GCP_STORAGE_BUCKET);

/**
 * Adding new file to the storage
 */
imageRouter.post('/upload', multer.single('file'), (req, res, next) => {
    console.log('Upload Image');

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
        console.log(error)
        reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
    });

    blobStream.end(file.buffer);
    });
}



imageRouter.get("/all/:userId", (req, res, next) => {
    if (req.params) {
        listFiles().then((files) => {
            res.status(201).send({ files });
        }).catch((error) => {
            console.error(error);
        });
    }
    async function listFiles() {
        // Lists files in the bucket
        const [files] = await bucket.getFiles();

        console.log('Files:');
        files.forEach(file => {
            console.log("d",file.name);
        });
        return files;
    }
});


imageRouter.get("/:imageId", (req, res, next) => {

});

imageRouter.put("/:imageId", (req, res, next) => {
   
});

imageRouter.delete("/:imageId", (req, res, next) => {
   
});

module.exports = imageRouter;


