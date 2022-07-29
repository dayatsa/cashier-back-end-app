const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const routes = express.Router();

routes
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  // .get(userController.getUsers)
  // .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

routes
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = routes;