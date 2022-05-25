/*jshint esversion: 6 */
const nodemailer = require("nodemailer");
const mailer = require("../../config/nodemailer.config").mailer;
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(mailer);

exports.sendMail = function (to, subject, text) {
  return transporter.sendMail({
    from: '"hotspot.epic.dm" <nodereply@hotspot.epic.dm>',
    to,
    subject,
    text
  });
};
