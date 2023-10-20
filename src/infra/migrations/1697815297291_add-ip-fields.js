/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('polls', {
        creator_ip: {
            type: 'inet',
            notNull: false,
        }
    });

    pgm.addColumns('poll_option_votes', {
        creator_ip: {
            type: 'inet',
            notNull: false,
        }
    });
};

exports.down = false
