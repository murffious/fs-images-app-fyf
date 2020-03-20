// packages
const express = require("express");
const imageRouter = express.Router();
const db = require("../models");
const Multer = require('multer');
const path = require("path");
const GCP_STORAGE_BUCKET = process.env.GCP_STORAGE_BUCKET

// file upload settings 
const multer = Multer({
storage: Multer.memoryStorage(),
limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
}
});

//GCP storage setup
var admin = require("firebase-admin");
var serviceAccount = require(path.join(__dirname, '../config/keys.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.GCP_DATABASE_URL
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
            contentType: file.mimetype,
            }
        });
        
        blobStream.on('error', (error) => {
            console.log(error)
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);   
        });

    
        blobStream.end(file.buffer);
        });
    }


    /**
     * Get all files/user // need to change this 
     * @param {User} eamil in this case userID is email return all files from db
     * //use folders if time or add id to upload
     */
    imageRouter.get("/all/:userId", (req, res, next) => {
        if (req.params) {
            listFiles().then((files) => {
            console.log("sending images")
            return res.status(201).send({ files });
            }).catch((error) => {
                console.error(error);
            });
        }

        async function listFiles() {
            const files =   await db.Image.findAll({
                include: [{
                model: db.User,
                where: { email: req.params.userId }
                }]
            }).then(images => {
                
                return images;
            });
        
            return files;
        }
    });


    /**
     * Get all files/user // need to change this 
     * return all files from  Google Storage //use folders if time or add id to upload
     */
    imageRouter.get("/all", async (req, res, next) => {
        // Lists files in the bucket - just helpful logging - can delete 
        const [files] = await bucket.getFiles();
        console.log('Files:');
        files.forEach(async file => {
            console.log("d",file.name);     
        });
        return res.status(201).send({ files });
    });


    imageRouter.get("/:imageId", (req, res, next) => {

    });

    imageRouter.put("/:imageId", (req, res, next) => {
        // https://firebase.google.com/docs/storage/web/file-metadata
        // Create a reference to the file whose metadata we want to change
        var forestRef = storageRef.child('images/forest.jpg');

        // Create file metadata to update
        var newMetadata = {
        cacheControl: 'public,max-age=300',
        contentType: 'image/jpeg'
        }

        // Update metadata properties
        forestRef.updateMetadata(newMetadata).then(function(metadata) {
        // Updated metadata for 'images/forest.jpg' is returned in the Promise
        }).catch(function(error) {
        // Uh-oh, an error occurred!
        });
    });

    imageRouter.delete("/:imageId", (req, res, next) => {
    
    });

module.exports = imageRouter;


