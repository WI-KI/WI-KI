var Minio = require('minio');
var CONFIG = require("../../config-server");

// Instantiate the minio client with the endpoint
// and access keys as shown below.
var minioClient = new Minio.Client(CONFIG.minio.config);

var bucketExists = (bucketName) => {
    return new Promise((resolve, reject) => {
        minioClient.bucketExists(bucketName, (err, exists) => {
            if (exists) resolve(true);
            else resolve(false);
        })
    })
}

var makeBucket = (bucketName) => {
    return new Promise((resolve, reject) => {
        minioClient.makeBucket(bucketName, '', err => {
            resolve();
        }); 
    })
} 

var fPutObject = (bucketName, fileName, filePath, metaData) => {
    return new Promise((resolve, reject) => {
        minioClient.fPutObject(bucketName, fileName, filePath, metaData, (err, etag) => {
            if (err) {
                console.log(err);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    })
}

var minio = {
    upload: async (fileName, filePath, metaData) => { 
        return new Promise(async (resolve, reject) => {
            bucketName = CONFIG.minio.bucketName;
            metaData = metaData || {};
            if (!await bucketExists(bucketName)) {
                await makeBucket(bucketName);
            }
            var ok = await fPutObject(bucketName, fileName, filePath, metaData);
            resolve(ok);
        })
    }
}

module.exports = minio;