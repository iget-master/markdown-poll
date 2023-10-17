/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async pgm => {
    await pgm.createTable('poll_options', {
        id: {
            type: 'uuid',
            default: pgm.func('gen_random_uuid()'),
            notNull: true,
            primaryKey: true,
            unique: true,
        },

        poll_id: {
            type: 'uuid',
            notNull: true,
        },

        index: {
            type: 'integer',
            notNull: true,
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
    });

    await pgm.createIndex('poll_options', ['poll_id']);
};

exports.down = false
