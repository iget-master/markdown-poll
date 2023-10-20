/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('poll_option_votes', {
        poll_id: {
            type: 'uuid',
            notNull: false,
        }
    });

    pgm.sql(`
        UPDATE poll_option_votes
        SET poll_id = poll_options.poll_id
        FROM poll_options
        WHERE poll_option_votes.poll_option_id = poll_options.id
    `)
};

exports.down = false
