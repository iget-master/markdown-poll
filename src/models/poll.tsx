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
async function findOneByUuid(uuid: string, options = {}) {
    const baseQuery = `
        SELECT
          *
        FROM
          polls
        WHERE
          id = $1
        LIMIT
          1
       `;

    const query = {
        text: baseQuery,
        values: [uuid],
    };

    const results = await database.query(query, options);

    if (results.rowCount === 0) {
        throw new NotFoundError({
            message: `O "uuid" informado não foi encontrado no sistema.`,
            action: 'Verifique se o "uuid" está digitado corretamente.',
            stack: new Error().stack,
            errorLocationCode: 'MODEL:POLL:FIND_ONE_BY_UUID:NOT_FOUND',
            key: 'uuid',
        });
    }

    return results.rows[0];
}
