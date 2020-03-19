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
    let url;
    let fileUpload = bucket.file(newFileName);
    // fileUpload.getSignedUrl({
    //     action: 'read',
    //     expires: '03-09-2491'
    //     }).then(signedUrls => {
    //         url = signedUrls[0]
    //     });

       
    
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
            //   https://storage.googleapis.com/images-6efd1.appspot.com/Screen%20Shot%202020-03-16%20at%205.19.22%20PM.png_1584641735914?GoogleAccessId=firebase-adminsdk-1fisj%40images-6efd1.iam.gserviceaccount.com&Expires=16447042800&Signature=iwhQA6Lc2Rs9DswgDTqAjcwilXeI3WKevUJLIR6rD3Rons9Fl%2BKmJ4SDobU5u1gJjJiANBZa1wwjQ9c%2BgnCrtKFD%2BcbWjXAY%2BgN69BGK5S4mTZI6FM0B68kXi%2FFKPw5zEdIJilco%2B2HP8nXF0ROPrSLJFY8M%2FumSUIp4jDg2IccDvGLqfBMBN6o82zfh4cEbLHJoZgtO8zfgJKJjd2ZBh%2F2yNUx3m6Xj2qLXQsIrvyXVEh9rxlNFfFAXJw%2Fnx43pPkvwRbPoos1MbmNhNpjMHvzsv%2F6LHsORWhRI7CWAIgFnlSk2eYu3UN%2Bpbbaek6QgUhwBd4JFS1yk3NlDvG1kkg%3D%3D
            // https://storage.googleapis.com/images-6efd1.appspot.com/Screen%20Shot%202020-03-16%20at%205.19.22%20PM.png_1584641735914?GoogleAccessId=firebase-adminsdk-1fisj%40images-6efd1.iam.gserviceaccount.com&Expires=16447042800&Signature=iwhQA6Lc2Rs9DswgDTqAjcwilXeI3WKevUJLIR6rD3Rons9Fl%2BKmJ4SDobU5u1gJjJiANBZa1wwjQ9c%2BgnCrtKFD%2BcbWjXAY%2BgN69BGK5S4mTZI6FM0B68kXi%2FFKPw5zEdIJilco%2B2HP8nXF0ROPrSLJFY8M%2FumSUIp4jDg2IccDvGLqfBMBN6o82zfh4cEbLHJoZgtO8zfgJKJjd2ZBh%2F2yNUx3m6Xj2qLXQsIrvyXVEh9rxlNFfFAXJw%2Fnx43pPkvwRbPoos1MbmNhNpjMHvzsv%2F6LHsORWhRI7CWAIgFnlSk2eYu3UN%2Bpbbaek6QgUhwBd4JFS1yk3NlDvG1kkg%3D%3D
            // https://storage.googleapis.com/images-6efd1.appspot.com/Screen%20Shot%202020-03-16%20at%205.19.22%20PM.png_1584641451688?GoogleAccessId=firebase-adminsdk-1fisj%40images-6efd1.iam.gserviceaccount.com&Expires=16447042800&Signature=c8rlZlUs4tlqrteTR7%2FOT1RLMlh1lkuZ4kAtNZ4hO7KHv8CKlwG%2FyJ%2BgaJXukO%2FXnutjeTGEO4yAXU8Q2lQx0Q7B5h%2BExctD9Ony9k6YcDiRmIPa%2FuFOj5nS593DzGC12aRO5OocWLoOcdg042eCtxYug5yV8KlM%2BeXzDLHhCYq4fACr%2BHiyWM1DtkSOdG1s5%2Ffd%2FXCEil86Fkkw2IdhD2lkB9juCEZWF%2BteLPaXNExYFkpPwci2hI0rHK5Ej2CKPtONDwMvUOlqJr96X2QHx1eqJZ9YHiw%2FJx8%2BNUSVD%2FX%2BxKPTRL%2BkulB23uI51MnG8X6aEQ9ujytw9COIOohSJA%3D%3D
            // https://storage.googleapis.com/images-6efd1.appspot.com/Screen%20Shot%202020-03-16%20at%205.19.22%20PM.png_1584641451688?GoogleAccessId=firebase-adminsdk-1fisj%40images-6efd1.iam.gserviceaccount.com&Expires=16447042800&Signature=c8rlZlUs4tlqrteTR7%2FOT1RL    
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


