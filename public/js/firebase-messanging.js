const notificationTokan = document.getElementById("notification-tokan").value;
const firebaseConfig = {
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

function IntitalizeFireBaseMessaging() {
  messaging
    .requestPermission()
    .then(function () {
      console.log("Notification Permission");
      return messaging.getToken({
        vapidKey: "BN5_SJiZiNzApqWkB2oliFHuD2TfkkmPhxyurXAaXcru9U49AGvwdEbDzLR82K94ua5dYeX-1_MyQPdcGh4abRw"
      });
    })
    .then(function (token) {
      // console.log("Token : " + token);
      // console.log(notificationTokan);
      if (!notificationTokan || notificationTokan.toString() != token.toString()) {
        fetch(host + '/set-notification-tokan', {
            method: 'POST',
            body: new URLSearchParams("tokan=" + token),
          })
          .then(response => {
            return response.json();
          })
          .then(data => {
            if (data.statusCode == 200) {
              console.log(data);
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
    })
    .catch(function (reason) {
      console.log(reason);
    });
}

messaging.onMessage(function (payload) {
  console.log(payload);
  const notificationOption = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };
  console.log(notificationOption);

  if (Notification.permission === "granted") {
    var notification = new Notification(payload.notification.title, notificationOption);
    notification.onclick = function (ev) {
      ev.preventDefault();
      window.open(payload.notification.click_action, '_blank');
      console.log(payload.notification.click_action);
      notification.close();
    }
  }

});
messaging.onTokenRefresh(function () {
  messaging.getToken()
    .then(function (newtoken) {
      console.log("New Token : " + newtoken);
    })
    .catch(function (reason) {
      console.log(reason);
    })
})
IntitalizeFireBaseMessaging();