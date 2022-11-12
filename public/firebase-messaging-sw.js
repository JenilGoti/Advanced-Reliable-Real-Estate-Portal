importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyDiSJvQ-hUyJLER2Ivnl7KdK2ITMu0Nwpg",
    authDomain: "nestscout-3626f.firebaseapp.com",
    projectId: "nestscout-3626f",
    storageBucket: "nestscout-3626f.appspot.com",
    messagingSenderId: "94017733197",
    appId: "1:94017733197:web:89cdbbd41f9c64e8b01204",
    measurementId: "G-76QJGXL45M"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    const notification = JSON.parse(payload);
    const notificationOption = {
        body: notification.body,
        icon: notification.icon
    };
    return self.registration.showNotification(payload.notification.title, notificationOption);
});