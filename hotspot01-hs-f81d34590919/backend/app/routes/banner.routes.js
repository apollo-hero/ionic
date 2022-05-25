// jshint esversion: 6
const banners = require('../controllers/banner.controller');
module.exports = (app) => {

  // Create a new Coupon
  app.post('/banners', banners.create);

  app.get('/banners/:bannerId', banners.findOne);

  // Get Transactional couponCode
  app.get('/banners', banners.findAll);

  // get wallet couponCode
  app.put('/banners/:bannerId', banners.update);

};
