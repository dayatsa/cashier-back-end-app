/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        name: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        email: {
          type: 'TEXT',
          unique: true,
          notNull: true,
        },
        password: {
          type: 'TEXT',
          notNull: true,
        },
        is_email_verified: {
            type: 'BOOLEAN',
            default: false,
        },
      });
};

exports.down = pgm => {
    pgm.dropTable('users');
};
