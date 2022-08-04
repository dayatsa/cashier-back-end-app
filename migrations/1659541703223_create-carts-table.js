/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('carts', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        paid: {
            type: 'BOOLEAN',
            default: false,
        },
    });

    // memberikan constraint foreign key pada USER_ID terhadap kolom id dari tabel users
    pgm.addConstraint('carts', 'fk_carts.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('carts');
};
