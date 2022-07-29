const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const ApiError = require('../utils/ApiError');


const pool = new Pool()

const createUser = async (userBody) => {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(userBody.password, 10);
    const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, userBody.name, userBody.email, hashedPassword, false],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add User');
    }
    return result.rows[0].id;
};


const getUserById = async (id) => {
    const query = {
        text: 'SELECT id, name, email, is_email_verified FROM users WHERE id = $1',
        values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User tidak ditemukan');
    }

    return result.rows[0];
};


const updateUserById = async (userId, updateBody) => {
    const hashedPassword = await bcrypt.hash(updateBody.password, 10);
    const query = {
        text: 'UPDATE users SET name = $1, email = $2, password = $3, is_email_verified = $4 WHERE id = $5 RETURNING id',
        values: [updateBody.name, updateBody.email, hashedPassword, updateBody.isEmailVerified, userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
};


const deleteUserById = async (userId) => {
    const query = {
        text: 'DELETE FROM users WHERE id = $1 RETURNING id',
        values: [userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
};

// module.exports = UsersService;
module.exports = {
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    //   UsersService,
};