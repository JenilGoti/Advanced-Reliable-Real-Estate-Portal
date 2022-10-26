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
    "private_key_id": process.env.IREBASE_PRIVATE_KEY_ID,
     "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": "firebase-adminsdk-cyr9s@nestscout-3626f.iam.gserviceaccount.com",
    "client_id": "113565594876657578725",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-cyr9s%40nestscout-3626f.iam.gserviceaccount.com"
};

const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: "gs://nestscout-3626f.appspot.com"
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

const storageRef = admin.storage().bucket("gs://nestscout-3626f.appspot.com");
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