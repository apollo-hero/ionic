/*jshint esversion: 6 */
const User = require('../models/user.model.js');
const Wallet = require('../models/wallet.model');
const mailer = require('../provider/nodemailer');
// Create and Save a new user
exports.create = (req, res) => {
  const user = new User(req.body);

  user.save()
    .then(data => {
      res.send({
        success: true,
        data
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    });
};

exports.search = (req, res) => {
  User.findOne({
    mobile: req.params.mobile
  }).then(user => {
    res.send({
      success: true,
      data: user
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users."
    });
  });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find()
    .then(users => {
      res.send({
        success: true,
        data: users
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.send(user);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.userId
      });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {

  User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.send({
        success: true,
        data: user
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Error updating user with id " + req.params.userId
      });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.send({
        message: "user deleted successfully!"
      });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Could not delete user with id " + req.params.userId
      });
    });
};

exports.forgetPassword = (req, res) => {
  const {
    username,
    password
  } = req.body;
  User.findOne({
      userName: username
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Not Registered "
        });
      }
      message = `Hello ${user.name}, Your password is ${user.password}`;
      return mailer.sendMail(username, "Password Recovery", message);
    });
};

// Get a user from database with username and then compare it
exports.login = (req, res) => {
  const {
    username,
    password
  } = req.body;
  User.findOne({
      userName: username
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Not Registered "
        });
      }
      if (user.password != password) {
        return res.status(404).send({
          success: false,
          message: "Invalid Credentials"
        });
      } else if (user.type == 2 && user.isActive == 0) {
        return res.status(404).send({
          success: false,
          message: "Not Allowed, Please ask admin to give you rights"
        });
      } else {
        return res.send({
          success: true,
          data: user
        });
      }
    });
};

// Get a user from database with username and then compare it
exports.changePassword = (req, res) => {
  const {
    oldPassword,
    password
  } = req.body;
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Not Registered "
        });
      }
      if (user.password != oldPassword) {
        return res.status(404).send({
          success: false,
          message: "Invalid Credentials"
        });
      } else if (user.type == 2 && user.isActive == 0) {
        return res.status(404).send({
          success: false,
          message: "Not Allowed, Please ask admin to give you rights"
        });
      } else {
        user.password = password;
        User.findByIdAndUpdate(req.params.userId, user, {
          new: true
        }).then(user => {
          return res.send({
            success: true,
            data: user
          });
        });
      }
    });
};

// get all vendors
exports.vendors = (req, res) => {
  User.find({
      type: 2
    })
    .populate('wallet')
    .then(users => {
      res.send({
        success: true,
        data: users
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// get all clients
exports.clients = (req, res) => {
  User.find({
      type: 3
    })
    .populate('wallet')
    .then(users => {
      res.send({
        success: true,
        data: users
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.addBalanceByAdmin = (req, res) => {
  let userId = req.body.userId;
  let amount = req.body.amount;
  User.findById(userId)
    .then(user => {
      amount = (1 + user.commision / 100) * amount;
      Wallet.findById(user.wallet).then(wallet => {
        wallet.balance = wallet.balance + amount;
        wallet.transactions.push({
          amount: amount,
          isCredit: true,
          createdOn: new Date(),
          details: {}
        });
        Wallet.findByIdAndUpdate(user.wallet, wallet).then(() => console.log('update wallet add Balane'));
      });
      res.send({
        success: true,
        data: {
          amountAdded: amount
        }
      });
    });
};

exports.addBalance = (userId, amount, charge, add) => {
  User.findById(userId)
    .then(user => {
      amount = add ? (1 + user.commision / 100) * amount : amount;
      Wallet.findById(user.wallet).then(wallet => {
        wallet.balance = wallet.balance + amount;
        wallet.transactions.push({
          amount: amount,
          isCredit: true,
          createdOn: new Date(),
          details: charge
        });
        Wallet.findByIdAndUpdate(user.wallet, wallet).then(() => console.log('update wallet add Balane'));
      });
    });
};

exports.getUserByUserName = (req, res) => {
  const userName = req.params.userName;
  User.findOne({
    userName: userName
  }).then(user => {
    if (!user) {
      return res.status(404).send({
        message: "user not found with id " + req.params.userName
      });
    }
    res.send({
      success: true,
      data: user
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users."
    });
  });
};

exports.registerToken = (req, res) => {
  const token = req.body.token;
  var userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      user.token = token;
      console.log(token, user, user.token);
      User.findByIdAndUpdate(userId, user, {
          new: true
        }).then(user => console.log(user))
        .catch(err => console.log(err));
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Error updating user with id " + req.params.userId
      });
    });
};
