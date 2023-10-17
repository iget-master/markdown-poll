import {create} from "@/models/poll";
import {ValidationError} from "@/infra/errors";
export async function POST(request: Request) {
    const payload = await request.json();

    try {
        return Response.json(await create(payload))
    } catch (error) {
        if (error instanceof ValidationError) {
            // @todo: parse validation error to create proper response
            return Response.json({
                name: 'ValidationError',
                message: error.message,
            }, {status: 400})
        }
    }
}
