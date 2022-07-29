const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService, authService } = require('../services');

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
  // await authService.logout(req.body.refreshToken);
  // res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  // const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  // res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  // await authService.resetPassword(req.query.token, req.body.password);
  // res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  // await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  // res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  // await authService.verifyEmail(req.query.token);
  // res.status(httpStatus.NO_CONTENT).send();
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