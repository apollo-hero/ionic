const plans = require('../controllers/plan.controller.js');
module.exports = (app) => {

  // Create a new Note
  app.post('/plans', plans.create);

  // Retrieve all plans
  app.get('/plans', plans.findAll);

  // Retrieve a single Note with noteId
  app.get('/plans/:planId', plans.findOne);

  // Update a Note with noteId
  app.put('/plans/:planId', plans.update);

  // Delete a plan with planId
  app.delete('/plans/:planId', plans.delete);
}
