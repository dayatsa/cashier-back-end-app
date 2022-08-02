const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');


const pool = new Pool()

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user.id;
};


const logout = async (refreshToken) => {
  const result = await tokenService.deleteToken(refreshToken, 'refresh');

  if (!result.rows.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
};


const refreshAuth = async (refreshToken) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
  const user = await userService.getUserById(refreshTokenDoc.user_id);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');;
  }
  await logout(refreshToken);
  return user;
};


const resetPassword = async (resetPasswordToken, newPassword) => {
  const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'reset');
  const user = await userService.getUserById(resetPasswordTokenDoc.user_id);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userService.updateUserById(user.id, { name: user.name, email: user.email, isEmailVerified: user.is_email_verified, password: hashedPassword });

  await tokenService.deleteTokenByUserId(user.id, 'reset')

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};



const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, 'verify');
    const user = await userService.getUserById(verifyEmailTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }

    await tokenService.deleteTokenByUserId(user.id, 'verify')
    await userService.updateUserWithoutPassById(user.id, { name: user.name, email: user.email, isEmailVerified: true, password: user.password });

  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};