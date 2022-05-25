// jshint esversion: 6
const Plan = require('../models/plan.model.js');

// Create and Save a new plan
exports.create = (req, res) => {
  const plan = new Plan(req.body);

  plan.save()
    .then(data => {
      res.send({
        success: true,
        data
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the plan."
      });
    });
};

// Retrieve and return all plans from the database.
exports.findAll = (req, res) => {
  Plan.find()
    .then(plans => {
      res.send({
        success: true,
        data: plans
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving plans."
      });
    });
};

// Find a single plan with a planId
exports.findOne = (req, res) => {
  Plan.findById(req.params.planId)
    .then(plan => {
      if (!plan) {
        return res.status(404).send({
          message: "plan not found with id " + req.params.planId
        });
      }
      res.send({
        success: true,
        data: plan
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "plan not found with id " + req.params.planId
        });
      }
      return res.status(500).send({
        message: "Error retrieving plan with id " + req.params.planId
      });
    });
};

// Update a plan identified by the planId in the request
exports.update = (req, res) => {

  Plan.findByIdAndUpdate(req.params.planId, req.body, {
      new: true
    })
    .then(plan => {
      if (!plan) {
        return res.status(404).send({
          message: "plan not found with id " + req.params.planId
        });
      }
      res.send({
        success: true,
        data: plan
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "plan not found with id " + req.params.planId
        });
      }
      return res.status(500).send({
        message: "Error updating plan with id " + req.params.planId
      });
    });
};

// Delete a plan with the specified planId in the request
exports.delete = (req, res) => {
  Plan.findByIdAndRemove(req.params.planId)
    .then(plan => {
      if (!plan) {
        return res.status(404).send({
          message: "plan not found with id " + req.params.planId
        });
      }
      res.send({
        success: true,
        data: 0,
        message: "plan deleted successfully!"
      });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "plan not found with id " + req.params.planId
        });
      }
      return res.status(500).send({
        message: "Could not delete plan with id " + req.params.planId
      });
    });
};
