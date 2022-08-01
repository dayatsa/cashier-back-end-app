const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService, authService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  try {
    const userId = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(userId);
    const response = {
      status: 'success',
      data: tokens
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

const login = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(userId);
    const response = {
      status: 'success',
      data: tokens
    }
    res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.UNAUTHORIZED).send(response)
  }
});

const logout = catchAsync(async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);
    const response = {
      status: 'success',
      message: 'Successfully logout'
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

const refreshTokens = catchAsync(async (req, res) => {
  try {
    const user = await authService.refreshAuth(req.body.refreshToken);
    const tokens = await tokenService.generateAuthTokens(user.id);
    const response = {
      status: 'success',
      data: tokens
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.UNAUTHORIZED).send(response)
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  try {  
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

    const response = {
      status: 'success',
      message: 'Successfully send reset password link'
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.UNAUTHORIZED).send(response)
  }
});

const resetPassword = catchAsync(async (req, res) => {
  try {  
    await authService.resetPassword(req.query.token, req.body.password);

    const response = {
      status: 'success',
      message: 'Successfully reset password'
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.UNAUTHORIZED).send(response)
  }
});


const sendVerificationEmail = catchAsync(async (req, res) => {
  try {  
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);

    const response = {
      status: 'success',
      message: 'Successfully send email verification'
    }
    res.send(response);
  } catch (error) {
    response = {
      "status": "fail",
      "message": error.message
    }
    res.status(httpStatus.UNAUTHORIZED).send(response)
  }
});


const verifyEmail = catchAsync(async (req, res) => {
  try {  
    await authService.verifyEmail(req.query.token);

    res.send("Email verified");
  } catch (error) {
    res.send(error.message)
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};