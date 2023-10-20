/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createIndex('poll_option_votes', ['poll_option_id', 'creator_ip'], {
        name: 'poll_option_votes_option_id_ip_unique_index',
        unique: true,
        where: 'creator_ip IS NOT NULL'
    });
};

exports.down = false
