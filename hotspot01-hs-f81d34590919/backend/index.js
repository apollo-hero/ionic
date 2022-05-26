 process.env.TZ = require('./config/env.config').timeZone;

 //var stripe = require('stripe')('');
 var stripe = require('stripe')('key');

 var express = require('express');
 var bodyParser = require('body-parser');
 var cors = require('cors');

 var app = express();
 var router = express.Router();

 app.use(bodyParser.urlencoded({
   extended: true,
   limit: '50mb'
 }));
 app.use(bodyParser.json({
   extended: true,
   limit: '50mb'
 }));
 app.use(cors());

 // Configuring the database
 const dbConfig = require('./config/database.config.js');
 const mongoose = require('mongoose');

 mongoose.Promise = global.Promise;
 mongoose.set('useFindAndModify', false);
 // Connecting to the database
 mongoose.connect(dbConfig.url)
   .then(() => {
     console.log("Successfully connected to the database");
   }).catch(err => {
     console.log('Could not connect to the database. Exiting now...');
     process.exit();
   });

 require('./app/routes/user.routes')(app);
 require('./app/routes/plan.routes')(app);
 require('./app/routes/voucher.routes')(app);
 require('./app/routes/wallet.routes')(app);
 require('./app/routes/banner.routes')(app);
 require('./app/routes/coupon.routes')(app);

 router.post('/processpay', function (request, response) {
   const {
     stripetoken,
     amountpayable,
     add,
     userId,
     discount
   } = request.body;
   const amount = parseFloat(amountpayable.toFixed(2)) * 100;
   var charge = stripe.charges.create({
     amount: amount,
     currency: 'xcd',
     description: 'EpicNet Hotspot Transaction',
     source: stripetoken.id
   }, function (err, charge) {
     if (err) {
       response.send({
         success: false,
         data: err
       });
     } else {
       require('./app/controllers/user.controller')
         .addBalance(userId, amountpayable + discount, charge, add);
       response.send({
         success: true,
         data: charge
       });
     }
   });
 });

 router.post('/processpay/planBuy', function (request, response) {
   const {
     stripetoken,
     amountpayable,
     add,
     userId,
     discount
   } = request.body;
   require('./app/controllers/user.controller')
     .addBalance(userId, amountpayable + discount, 0, false);
   response.send({
     success: true,
     data: userId
   });
 });

 app.use(router);

 var fs = require('fs');
 var http = require('http');
 var https = require('https');
 var privateKey = fs.readFileSync('./config/hotspot.epic.dm/privkey1.pem', 'utf8');
 var certificate = fs.readFileSync('./config/hotspot.epic.dm/fullchain1.pem', 'utf8');

 var credentials = {
   key: privateKey,
   cert: certificate
 };
 // your express configuration here

 var httpServer = http.createServer(app);
 var httpsServer = https.createServer(credentials, app);

 httpServer.listen(3333);
 httpsServer.listen(3334);
