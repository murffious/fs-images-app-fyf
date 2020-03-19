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
        // The public URL can be used to directly access the file via HTTP.
        // write my own format remember to escape space or % stuff 
        // const publicUrl = .format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        // resolve(publicUrl)  format not a function error from google code - outdatedl ikley
        const publicUrl = fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
            }).then(signedUrls => {
                console.log(signedUrls[0])
                db.Image.create({
                    publicUrl: signedUrls[0],
                    UserId: 26
                  }).then(function (publicUrl){
                        resolve(publicUrl)
                  }).catch(function(err) {
                    console.log(err)
                    
                  });
            }) 
          
        // resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
    });

   
    blobStream.end(file.buffer);
    });
}


/**
 * Get all files // need to change this 
 */
imageRouter.get("/all/:userId", (req, res, next) => {
  
    const regenerateThumbnailUrls = async (data, context) => {
        const images = await bucket.getFiles();
        const SIZES = [64, 128, 512];
        images.forEach(image => {
          const thumbnails = image[0].thumbnailUrls;
          const imageId = image[0].id;
          const imageName = image[0].metadata.name.split(".")[0];
      console.log(thumbnails, imageId, imageName)
          SIZES.forEach(size => {
            const thumbnailFileName = `thumb_${imageName}_${size}.jpg`;
            const storagePath = imageId + "/" + thumbnailFileName;
            console.log(storagePath);
            bucket
              .file(storagePath)
              .getSignedUrl({
                action: 'read',
                expires: '03-09-2491'})
              .then(signedUrls => {
                // console.log(signedUrls[0]);
                
              }).then(urls=> {
                return urls
              })
              .catch(error => {
                console.log(error);
              });
          });
        });
      };
    if (req.params) {
        listFiles().then((files) => {
        //    const newFiles =  regenerateThumbnailUrls(files)
            res.status(201).send({ files });
        }).catch((error) => {
            console.error(error);
        });
    }
 
   
    
    async function listFiles() {
        // Lists files in the bucket
        const [files] = await bucket.getFiles();
        console.log('Files:');
        files.forEach(async file => {
            
            // var url = (await file.getDownloadURL()).toString();
            // console.log(url.toString(), url)
          
            //  await file.getSignedUrl({
            //     action: 'read',
            //     expires: '03-09-2491'
            //     }).then(signedUrls => {
                    
            //         URLS.push(signedUrls[0].toString())
            //     });
            console.log("d",file.name);

            
        });
        return files;
    }
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


