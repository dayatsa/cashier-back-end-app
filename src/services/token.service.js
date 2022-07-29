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


module.exports = {
    generateToken,
    // saveToken,
    // verifyToken,
    generateAuthTokens,
    // generateResetPasswordToken,
    // generateVerifyEmailToken,
};