const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const itemValidation = require('../../validations/item.validation')
const itemController = require('../../controllers/item.controller');

const routes = express.Router();

routes
  .route('/')
  .post(auth(), validate(itemValidation.createItem), itemController.createItem)
  .get(auth(), itemController.getItems);

routes
  .route('/:itemId')
  .get(auth(), validate(itemValidation.getItem), itemController.getItem)
  .patch(auth(), validate(itemValidation.updateItem), itemController.updateItem)
  .delete(auth(), validate(itemValidation.deleteItem), itemController.deleteItem);

// routes
//   .route('/admin')
//   .post(auth('manageUsers'), validate(userValidation.updateRoleUser), userController.updateRoleUser)

module.exports = routes;