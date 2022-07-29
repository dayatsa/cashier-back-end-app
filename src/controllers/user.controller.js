const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  try {
    const userId = await userService.createUser(req.body);
    const response = {
      status: 'success',
      message: 'Successfully added new user',
      data: {
        userId,
      },
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


const getUser = catchAsync(async (req, res) => {
    try {    
      const user = await userService.getUserById(req.params.userId);
      const response = {
        status: 'success',
        data: {
          "id": user.id,
          "name": user.name,
          "email": user.email,
          "isEmailVerified": user.is_email_verified,
        },
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


const updateUser = catchAsync(async (req, res) => {
  try {
    await userService.updateUserById(req.params.userId, req.body);
    const response = {
      status: 'success',
      message: 'Succesfully update user'
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

const deleteUser = catchAsync(async (req, res) => {
  try {
    await userService.deleteUserById(req.params.userId);
    const response = {
      status: 'success',
      message: 'Succesfully delete user'
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
  createUser,
  getUser,
  updateUser,
  deleteUser,
};