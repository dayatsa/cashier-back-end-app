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
        text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [id, userBody.name, userBody.email, hashedPassword, 'user', false],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add User');
    }
    return result.rows[0].id;
};


const queryUsers = async () => {
    const query = {
        text: 'SELECT id, name, email, role, is_email_verified FROM users',
        values: [],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return result.rows;
};


const getUserById = async (id) => {
    const query = {
        text: 'SELECT id, name, email, role, is_email_verified FROM users WHERE id = $1',
        values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return result.rows[0];
};


const getUserByEmail = async (email) => {
    const query = {
        text: 'SELECT id, name, email, role, is_email_verified, password FROM users WHERE email = $1',
        values: [email],
    };

    const result = await pool.query(query);

    return result.rows[0];
};


const updateUserById = async (userId, updateBody) => {
    const query = {
        text: 'UPDATE users SET name = $1, email = $2, password = $3, is_email_verified = $4 WHERE id = $5 RETURNING id',
        values: [updateBody.name, updateBody.email, updateBody.password, updateBody.isEmailVerified, userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
};


const updateUserWithoutPassById = async (userId, updateBody) => {
    const query = {
        text: 'UPDATE users SET name = $1, email = $2, is_email_verified = $3 WHERE id = $4 RETURNING id',
        values: [updateBody.name, updateBody.email, updateBody.isEmailVerified, userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
};


const updateRoleUserById = async (requestBody) => {
    if (requestBody.role !== "user" && requestBody.role !== "admin") {
        throw new ApiError(httpStatus.FORBIDDEN, 'Role must be user or admin')
    }

    const query = {
        text: 'UPDATE users SET role = $1 WHERE id = $2 RETURNING role',
        values: [requestBody.role, requestBody.userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    console.log(result.rows[0])
    return result.rows[0].role;
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


module.exports = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    updateUserWithoutPassById,
    updateRoleUserById,
    deleteUserById,
};