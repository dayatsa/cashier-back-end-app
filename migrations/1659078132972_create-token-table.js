/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('authentications', {
        token: {
            type: 'TEXT',
            notNull: true,
            required: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            required: true,
        },
        type: {
            type: 'VARCHAR(50)',
            enum: ['refresh', 'reset', 'verify'],
            required: true,
        },
        expires: {
            type: 'TIMESTAMP',
            required: true,
        },
        blacklisted: {
            type: 'BOOLEAN',
            default: false,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('authentications');
 };
