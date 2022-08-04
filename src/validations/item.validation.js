
const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createItem = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createItem,
  getItem,
  updateItem,
  deleteItem
};