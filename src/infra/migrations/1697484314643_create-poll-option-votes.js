/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async pgm => {
    await pgm.createTable('poll_option_votes', {
        id: {
            type: 'uuid',
            default: pgm.func('gen_random_uuid()'),
            notNull: true,
            primaryKey: true,
        },
        poll_option_id: {
            type: 'uuid',
            notNull: true,
        }
    })

    await pgm.createIndex('poll_option_votes', ['poll_option_id']);
};

exports.down = false;
