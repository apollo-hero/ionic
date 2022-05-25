// jshint esversion: 6
var admin = require('firebase-admin');
var serviceAccount = require("../../config/fcmkey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://epichotspot-373d0.firebaseio.com"
});
exports.sendNotification = (registrationToken, plan) => {
  var notiBody = `New plan of price ${plan.price} with validity ${plan.duration_val} has been added successfully`;
  var message = {
    android: {
      data: {
        title: 'New plan added',
        body: notiBody,
        android_channel_id: "testchannel1",
        sound: "true",
        forceShow: "true"
      },
      notification: {
        title: 'New plan added',
        body: notiBody,
        channelId: "testchannel1",
        sound: "true"
      }
    },
    token: registrationToken
  };
  admin.messaging().send(message)
    .then(d => console.log(d))
    .catch(err => console.error(err));
};
