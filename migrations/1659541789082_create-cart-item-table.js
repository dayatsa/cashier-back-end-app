exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('cart_items', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    cart_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    item_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('cart_items', 'fk_cart_items.cart_id.id', 'FOREIGN KEY(cart_id) REFERENCES carts(id) ON DELETE CASCADE');
  pgm.addConstraint('cart_items', 'fk_cart_items.item_id.id', 'FOREIGN KEY(item_id) REFERENCES items(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropTable('cart_items');
};