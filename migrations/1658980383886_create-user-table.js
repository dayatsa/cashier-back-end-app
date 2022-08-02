/* eslint-disable camelcase */

const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

exports.shorthands = undefined;

exports.up = async pgm => {
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
    role: {
      type: 'VARCHAR(20)',
      default: 'user',
    },
    is_email_verified: {
      type: 'BOOLEAN',
      default: false,
    },
  });
  const id = `user-${nanoid(16)}`;
  const hashedPassword = await bcrypt.hash('admin', 10);

  pgm.sql(`INSERT INTO users (id, name, email, password, role, is_email_verified) VALUES
    ('${id}', 'admin', 'admin@gmail.com', '${hashedPassword}', 'admin', ${false});`)
};

exports.down = pgm => {
  pgm.dropTable('users');
};
