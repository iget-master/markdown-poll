import { NotFoundError, ValidationError } from '../infra/errors';
import database from '@/infra/database.js';

async function findAllByPollId(pollId: string, options = {}) {
    const baseQuery = `
        SELECT
          *
        FROM
          poll_options
        WHERE
          poll_id = $1
       `;

    const query = {
        text: baseQuery,
        values: [pollId],
    };

    const results = await database.query(query, options);

    if (results.rowCount === 0) {
        throw new NotFoundError({
            message: `O "poll_id" informado não foi encontrado no sistema.`,
            action: 'Verifique se o "poll_id" está digitado corretamente.',
            stack: new Error().stack,
            errorLocationCode: 'MODEL:POLL:FIND_ALL_BY_POLL_ID:NOT_FOUND',
            key: 'poll_id',
        });
    }

    return results.rows;
}

export default Object.freeze({
    findAllByPollId
})
