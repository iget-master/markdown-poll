import {create} from "@/models/poll";
import {ValidationError} from "@/infra/errors";
import {headers} from "next/headers";
export async function POST(request: Request) {
    const payload = await request.json();
    const creator_ip = headers().get('x-forwarded-for');

    try {
        return Response.json(await create(payload, creator_ip))
    } catch (error) {
        if (error instanceof ValidationError) {
            // @todo: parse validation error to create proper response
            return Response.json({
                name: 'ValidationError',
                message: error.message,
            }, {status: 400})
        } else {
            throw error;
        }
    }
}
