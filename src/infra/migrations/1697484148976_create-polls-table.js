/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async pgm => {
    await pgm.createTable('polls', {
        id: {
            type: 'uuid',
            default: pgm.func('gen_random_uuid()'),
            notNull: true,
            primaryKey: true,
        },

        title: {
            type: 'varchar(255)',
            notNull: true,
        },

        created_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func("(now() at time zone 'utc')"),
        },

        updated_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func("(now() at time zone 'utc')"),
        },
    })
};

exports.down = async pgm => {
    await pgm.dropTable('polls');
};
