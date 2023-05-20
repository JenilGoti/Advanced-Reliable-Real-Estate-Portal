const firebaseAdmin = require('firebase-admin');
const resizeImg = require('resize-image-buffer');

const User = require("../models/user");

const multer = require('multer');
const request = require('request');
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
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbccNfZMiweu0q\n1yRXLn4s/dVeUlRAUYWSUcPWISy2emrOpBnn0aRRucX3+N7b3ObVwPJI5kDH3OCo\nYabup+511QmSbXnOULvNjUr/s+GWkovsrjWcX9T0IbEQ/W2RLW27W4kpVX5BN/kV\ncUd4ce13NX+9Ke6jwS3FYQ+Yrm8VWFKsxGov1QhBD8r0y2hggzuMbX5R3xOk0enZ\ne7ivC7obuG6VHqviUKozBfnwdHY5w7Ba6HOhWgY0Qs20jNMteeWwXx8AwI7QREZr\nzbPOUwkKC48rVqKTCgsPMxjEwXQ8Hrc0zoKSbC9DDUxSfjGg8Lw68qXjiUktvrpd\nen1xKI73AgMBAAECggEAGb7NW5LfNG+fsV1BvRjLuBrwiHc9UgvOgi39sAz9kVmU\nMBZ43e7Ydtq8gbYb/zFGoDedSVqtdwzLvsextMxmj+iRdcmhB31SpZhVyCUcY2px\nN2mhIn2y0R51a7l1uLpb9tCR1qE80IN7Q0RoUHgaGwjm18dGqaOYt5y8Tw7xAglF\nThTkPutticiTgB84VpL47soEAScbKaMifFGNcDtxi26cPS5ZQGwF4rkZ18DmGNSl\nCz9bvUx9OiA6LxHyneIUYEc87WCaJOx1remOaAxzsvnKXrmu3g9jD4zd9Qw85m/t\n3G7Kf0Lmg+gaXLtCWdnTmfTzSrFBswKNp2JTE9+VIQKBgQDKWLpwlJcBoIMWojhT\nWfy4G1Pgb4nYWhMrKp2Z6H4NN5n8pPUd8PQoqvIMuivC1kvUC2p9CHjbIXdaDLoU\nbbP8+EEAaj30SbsKnoR1QwPi0Z7LDXOXHU0mVl9M9MTQ9EfP57Fd9IW7DPiXQw+f\n/ZwODGNgK0tb7B6vFeMMgPv21wKBgQDEqVEKLdo3azvWa90pnqm2o1MrEeOLxNwO\nxxygGHQ7lNXY7PPmoGyMUNS93oUIrVp0FJ18CSAggTgldBlRYQ1mYbxtRoinD2hI\nimf6vFhXa3ZeYkH1i0PCd3nSBGk5ExuuZQZuwQgydjFtVNO1u1X3hgi3QMXD7f/s\nesJRrAjE4QKBgBvDUNFhkdaHT3UrjM7i6enY1glVRHSK51Zk4nrbi3AE0Pv5JiiV\nhuqNieh1Isv42y6c4l+Fag+m59lTJbTn2Go9Ja4I5bc+5orudP4h08arPD5f+hwh\nyRQZhbnpW5fP7Ip6H7vkcPTZMsKOUPaCtYa37GqlhhF2tD8RobV1fRzBAoGAFSJp\nDiH9WIVSqelvnCBr9q+4qWFDxeqDB6eIQQA/xYNqM+TLFVbaM34gTsNSIquWk/D/\nN6w3YqbgZM4ERoWajg0k1c2FtAZo25rcL8r753EqCFyg4AV2Y7i5Q8OrlzGhgO1k\ncpSWD+45w5khI1+djns+BouUdUjnfv92UJafXqECgYA7mShBHaCBtngRZq+1sv+W\nTR0j/uOYMQCZ9oIJytK7TtNiv704FyL0NAqgl3PmlxiJgtyOXgtm8DsTz2Z7vYkm\nDvV1VzvZD1AWdyYjuEHvuAGinSxbmJNbWJjPiMm8UiQboIGc4Hb1jqrpq3bt50lU\ncCmEVRoLH4awVGZeaGD3Jw==\n-----END PRIVATE KEY-----\n",
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_X509_CERT_URL
}

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
}).array('image', 10);

const storageRef = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
const bucket = admin.storage().bucket();

function fileURL(fileName) {

    return bucket.file('/NESTSCOUT' + fileName).getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });
}

async function uploadFile(file, path, fileName, height, width) {
    if (height && width) {
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

    bucket.file('/NESTSCOUT' + path + fileName).createWriteStream().end(file.buffer)

    return fileURL(path + fileName);
}

async function deleteFile(path) {
    try {
        await bucket.deleteFiles({
            prefix: '/NESTSCOUT/users/' + path
        })
        console.log("deleted");
    } catch (err) {
        console.log(err);
    }

}


function sendNotification(userIds, title, body, click_action, icon, data = {}) {
    userIds.forEach(async (userId) => {
            try {
                var user = await User.findById(userId).select("notificationTokan");
                const token = user.notificationTokan;
                console.log(token);
                if (token) {
                    const notification = {
                        "to": token,
                        "collapse_key": "type_c",
                        "notification": {
                            "body": body,
                            "title": title,
                            "click_action": click_action,
                            "icon": icon
                        },
                        "data": data
                    }
                    request({
                            method: 'POST',
                            uri: 'https://fcm.googleapis.com/fcm/send',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: process.env.FIREBASE_SERVER_API
                            },
                            body: JSON.stringify(notification)
                        }, (error, response, body) => {
                            if (error) {
                                console.log(error);
                                console.log("error found");
                            } else {
                            console.log(body);
                        }
                    })
            }

        } catch (err) {
            console.log(err);
        }

    });

} 




exports.deleteFile = deleteFile;
exports.uploadFile = uploadFile;
exports.fileURL = fileURL;
exports.sendNotification = sendNotification;