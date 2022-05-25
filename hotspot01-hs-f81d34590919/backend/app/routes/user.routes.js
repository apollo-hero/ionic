/*jshint esversion: 6 */
const users = require('../controllers/user.controller.js');
module.exports = (app) => {

  // Create a new Note
  app.post('/vendors', users.create);

  // Retrieve all users
  app.get('/users', users.findAll);

  // get user by userName (email)
  app.get('/vendors/userName/:userName', users.getUserByUserName);

  app.get('/vendors/search/:mobile', users.search);

  app.get('/vendors/users', users.clients);

  // Retrieve a single Note with noteId
  app.get('/users/:userId', users.findOne);

  // Update a Note with noteId
  app.put('/vendors/:userId', users.update);

  app.post('/vendors/addBalance', users.addBalanceByAdmin);
  app.put('/vendors/changePassword/:userId', users.changePassword);
  app.put('/vendors/registerToken/:userId', users.registerToken);


  // Delete a user with userId
  app.delete('/users/:userId', users.delete);

  app.put('/login', users.login);
  app.put('/forgetPassword', users.forgetPassword);

  app.get('/vendors', users.vendors);
};
