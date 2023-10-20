/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // index was created using wrong column `poll_option_id` instead of `poll_id`
    pgm.dropIndex('poll_option_votes', [], {
        name:'poll_option_votes_option_id_ip_unique_index'
    });

    pgm.createIndex('poll_option_votes', ['poll_id', 'creator_ip'], {
        name: 'poll_option_votes_option_id_ip_unique_index',
        unique: true,
        where: 'creator_ip IS NOT NULL'
    });
};

exports.down = false
