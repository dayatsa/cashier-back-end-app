const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const ApiError = require('../utils/ApiError');

const pool = new Pool()


const createItem = async (userId, itemBody) => {
    const id = `item-${nanoid(16)}`;
    const query = {
        text: 'INSERT INTO items VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, itemBody.name, itemBody.price, userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add Item');
    }
    return result.rows[0].id;
};


const queryItems = async (userId) => {
    const query = {
        text: 'SELECT id, name, price FROM items WHERE owner = $1',
        values: [userId],
    };

    const result = await pool.query(query);

    return result.rows;
};


const getItemById = async (owner, id) => {
    const query = {
        text: 'SELECT * FROM items WHERE id = $1 AND owner = $2',
        values: [id, owner],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }

    return result.rows[0];
};


const updateItemById = async (userId, itemId, updateBody) => {
    const query = {
        text: 'UPDATE items SET name = $1, price = $2 WHERE id = $3 AND owner = $4 RETURNING id',
        values: [updateBody.name, updateBody.price, itemId, userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
};


const deleteItemById = async (userId, itemId) => {
    const query = {
        text: 'DELETE FROM items WHERE id = $1 AND owner = $2 RETURNING id',
        values: [itemId, userId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
};


module.exports = {
    createItem,
    queryItems,
    getItemById,
    updateItemById,
    deleteItemById
};