const express = require('express');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const validate = require('../../middlewares/validate');

const routes = new express.Router();

routes.post('/register', validate(authValidation.register), authController.register);
routes.post('/login', validate(authValidation.login), authController.login);
routes.post('/logout', validate(authValidation.logout), authController.logout);
routes.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
routes.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
routes.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
// routes.post('/send-verification-email', auth(), authController.sendVerificationEmail);
routes.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = routes;
