import { NotFoundError, ValidationError } from '../infra/errors';
import database from '@/infra/database.js';
import validator from '@/models/validator.js';

export type PollData = {
    title: string,
    options: string[]
}

export type PollOption = {
    id: string,
    poll_id: string,
    title: string,
    index: number,
    votes?: number,
};

export type Poll = {
    id: string,
    title: string,
    options: Array<PollOption>
};
function validatePostSchema(postedPollData: PollData) {
    return validator(postedPollData, {
        title: 'required',
        options: 'required',
    });
}
export async function create(postedPollData: PollData, creator_ip: string|null) {
    const validPollData = validatePostSchema(postedPollData);

    return await runInsertQuery(validPollData);

    async function runInsertQuery(validPollData: PollData) {
        const transaction = await database.transaction();

        try {
            await transaction.query('BEGIN');

            const poll = (await transaction.query({
                text: 'INSERT INTO polls (title, creator_ip) VALUES ($1, $2) RETURNING *;',
                values: [validPollData.title, creator_ip]
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
export async function findOneById(id: string, computeVotes: boolean = false, options = {}): Promise<Poll> {
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
                   LEFT JOIN poll_option_votes ON poll_options.id = poll_option_votes.poll_option_id
                   WHERE poll_options.poll_id = $1 
                   GROUP BY poll_options.id
                   ORDER BY index
                   LIMIT 5`,
            values: [id],
        }, options));
    } else {
        optionsResults = (await database.query({
            text: "SELECT * FROM poll_options WHERE poll_id = $1 ORDER BY index LIMIT 5",
            values: [id],
        }, options));
    }


    return {
        ...pollResults.rows[0],
        options: optionsResults.rows.map((option: any) => ({
            ...option,
            votes: typeof option.votes === 'string' ? parseInt(option.votes) : option.votes
        }))
    }
}

export async function computeVoteByOptionId(id: string, creator_ip: string|null, options = {}) {
    const poll_id = (await database.query({
        text: "SELECT poll_id FROM poll_options WHERE id = $1 LIMIT 1",
        values: [id],
    }, options)).rows[0]?.poll_id;

    if (!poll_id) {
        throw new NotFoundError({
            message: `O "uuid" informado não foi encontrado no sistema.`,
            action: 'Verifique se o "uuid" está digitado corretamente.',
            stack: new Error().stack,
            errorLocationCode: 'MODEL:POLL:VOTE_BY_OPTION_ID:NOT_FOUND',
            key: 'uuid',
        });
    }

    try {
        console.log([id, poll_id, creator_ip]);
        await database.query({
            text: "INSERT INTO poll_option_votes (poll_option_id, poll_id, creator_ip) VALUES ($1, $2, $3)",
            values: [id, poll_id, creator_ip]
        })
        return true;
    } catch (error) {
        return false;
    }
}

export async function getStatistics() {
    const pollsCount = (await database.query({
        text: "SELECT count(*) as count FROM polls;"
    })).rows[0].count;

    const optionsCount = (await database.query({
        text: "SELECT count(*) as count FROM poll_options;"
    })).rows[0].count;

    const votesCount = (await database.query({
        text: "SELECT count(*) as count FROM poll_option_votes;"
    })).rows[0].count;

    return {
        pollsCount,
        optionsCount,
        votesCount,
    }
}
