const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Pool } = require('pg');
const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

require('dotenv').config();
const pool = new Pool()

const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};


const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const query = {
        text: 'INSERT INTO authentications VALUES($1, $2, $3, $4, $5)',
        values: [token, userId, type, expires.toDate(), blacklisted],
    };

    await pool.query(query);
};


const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const query = {
        text: 'SELECT * FROM authentications WHERE user_id = $1 AND blacklisted = $2',
        values: [payload.sub, false],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new Error('Token not found');
    }
    return result.rows[0];
};


const generateAuthTokens = async (userId) => {
    const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
    const accessToken = generateToken(userId, accessTokenExpires, 'access');

    const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
    const refreshToken = generateToken(userId, refreshTokenExpires, 'refresh');
    await saveToken(refreshToken, userId, refreshTokenExpires, 'refresh');

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};


const generateResetPasswordToken = async (email) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, 'reset');
    await saveToken(resetPasswordToken, user.id, expires, 'reset');
    return resetPasswordToken;
};


const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, 'verify');
    await saveToken(verifyEmailToken, user.id, expires, 'verify');
    return verifyEmailToken;
};


module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};