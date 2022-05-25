// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
/*jshint esversion: 6 */
const twilioToken = require('../../config/twilio.config');
const client = require('twilio')(twilioToken.accountSid, twilioToken.authToken);

exports.sendMessage = function (to, msg) {
  console.log(to);
  client.messages
    .create({
      body: msg,
      from: '+12013081937',
      to: to
    })
    .then(message => console.log(message.sid));
};
