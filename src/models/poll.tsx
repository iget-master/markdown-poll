import { NotFoundError, ValidationError } from '../infra/errors';
import database from '@/infra/database.js';
import validator from '@/models/validator.js';

export type PollData = {
    title: string,
    options: string[]
}
function validatePostSchema(postedPollData: PollData) {
    return validator(postedPollData, {
        title: 'required',
        options: 'required',
    });
}
export async function create(postedPollData: PollData) {
    const validPollData = validatePostSchema(postedPollData);

    return await runInsertQuery(validPollData);

    async function runInsertQuery(validPollData: PollData) {
        const transaction = await database.transaction();

        try {
            await transaction.query('BEGIN');

            const poll = (await transaction.query({
                text: 'INSERT INTO polls (title) VALUES ($1) RETURNING *;',
                values: [validPollData.title]
            })).rows[0];

            poll.options = [];

            for (let [index, title] of validPollData.options.entries()) {
                const option = (await transaction.query({
                    text: 'INSERT INTO poll_options (poll_id, index, title) VALUES ($1, $2, $3) RETURNING poll_id, index, title;',
                    values: [
                        poll.id,
                        index,
                        title
                    ]
                })).rows[0]

                poll.options.push(option);
            }
            await transaction.query('COMMIT');
            await transaction.release();

            return poll;

        } catch (error) {
            await transaction.query('ROLLBACK');
            await transaction.release();
            throw error;
        }
    }
}
export async function findOneById(id: string, computeVotes: boolean = false, options = {}) {
    const pollResults = (await database.query({
        text: "SELECT * FROM polls WHERE id = $1 LIMIT 1",
        values: [id],
    }, options));

    if (pollResults.rowCount === 0) {
        throw new NotFoundError({
            message: `O "uuid" informado não foi encontrado no sistema.`,
            action: 'Verifique se o "uuid" está digitado corretamente.',
            stack: new Error().stack,
            errorLocationCode: 'MODEL:POLL:FIND_ONE_BY_UUID:NOT_FOUND',
            key: 'uuid',
        });
    }

    let optionsResults;

    if (computeVotes) {
        optionsResults = (await database.query({
            text: `SELECT poll_options.*, COUNT(poll_option_votes) as votes FROM poll_options
                   JOIN poll_option_votes ON poll_options.id = poll_option_votes.poll_option_id
                   WHERE poll_id = $1 
                   GROUP BY poll_options.id
                   LIMIT 5`,
            values: [id],
        }, options));
    } else {
        optionsResults = (await database.query({
            text: "SELECT * FROM poll_options WHERE poll_id = $1 LIMIT 5",
            values: [id],
        }, options));
    }


    return {
        ...pollResults.rows[0],
        options: optionsResults.rows
    }
}

export async function computeVoteByOptionId(id: string, options = {}) {
    const optionExists = (await database.query({
        text: "SELECT count(*) as count FROM poll_options WHERE id = $1 LIMIT 1",
        values: [id],
    }, options)).rows[0].count === '1';

    if (!optionExists) {
        throw new NotFoundError({
            message: `O "uuid" informado não foi encontrado no sistema.`,
            action: 'Verifique se o "uuid" está digitado corretamente.',
            stack: new Error().stack,
            errorLocationCode: 'MODEL:POLL:VOTE_BY_OPTION_ID:NOT_FOUND',
            key: 'uuid',
        });
    }

    await database.query({
        text: "INSERT INTO poll_option_votes (poll_option_id) VALUES ($1)",
        values: [id]
    })
}
