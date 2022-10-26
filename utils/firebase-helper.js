const firebaseAdmin = require('firebase-admin');
const resizeImg = require('resize-image-buffer');
const multer = require('multer');
const path = require("path");

const {
    url
} = require('inspector');
const {
    fileLoader
} = require('ejs');

const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_X509_CERT_URL
}
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const memoryStorage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, +new Date() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

exports.multerSingleFile = multer({
    dest: 'images',
    storage: memoryStorage,
    fileFilter: fileFilter,
}).single('image');

exports.multerMultipaleFile = multer({
    dest: 'images',
    storage: memoryStorage,
    fileFilter: fileFilter,
}).array('image', 5);

const bucket = admin.storage().bucket();

function fileURL(fileName) {

    return bucket.file('/NESTSCOUT' + fileName).getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });
}

function uploadFile(file, path, fileName, height, width) {
    return resizeImg(file.buffer, {
            width: width,
            height: height,
        })
        .then(buffer => {
            return bucket.file('/NESTSCOUT' + path + fileName).createWriteStream().end(buffer);
        })
        .then(fileLoader => {
            return fileURL(path + fileName);
        })
}

exports.uploadFile = uploadFile;
exports.fileURL = fileURL;