const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { itemService } = require('../services');


const createItem = catchAsync(async (req, res) => {
  try {
    const id = await itemService.createItem(req.user.id, req.body);
    const response = {
      status: 'success',
      data: id
    }
    res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.BAD_REQUEST).send(response)
  }
});


const getItems = catchAsync(async (req, res) => {
  try {
    const items = await itemService.queryItems(req.user.id);
    const response = {
      status: 'success',
      data: {
        owner: req.user.id,
        items
      }
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.BAD_REQUEST).send(response)
  }
});


const getItem = catchAsync(async (req, res) => {
  try {    
    const data = await itemService.getItemById(req.user.id, req.params.itemId);
    const response = {
      status: 'success',
      data
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.NOT_FOUND).send(response)
  }
});


const updateItem = catchAsync(async (req, res) => {
  try {
    await itemService.updateItemById(req.user.id, req.params.itemId, req.body);
    const response = {
      status: 'success',
      message: 'Succesfully update item'
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.BAD_REQUEST).send(response)
  }
});


const deleteItem = catchAsync(async (req, res) => {
  try {
    await itemService.deleteItemById(req.user.id, req.params.itemId);
    const response = {
      status: 'success',
      message: 'Succesfully delete item'
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.BAD_REQUEST).send(response)
  }
});


module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
};