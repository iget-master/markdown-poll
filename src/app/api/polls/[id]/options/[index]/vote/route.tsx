import {createCanvas} from "canvas";
import {NextRequest, NextResponse} from "next/server";
import {computeVoteByOptionId, findOneById, PollOption} from '@/models/poll';
import {cookies, headers} from "next/headers";
import {redirect} from "next/navigation";

type PollOptionImageProps = {
    params: {
        id: string;
        index: string;
    },
}
export async function GET(request: NextRequest, { params: {id, index} }: PollOptionImageProps) {
    const url = new URL(request.url);
    const shouldClose = url.searchParams.get('close')
    const poll = await findOneById(id);
    const ip = headers().get('x-forwarded-for');

    if (!index?.match(/^\d+$/)) {
        // @todo: throw a correct error
        throw 'Invalid option index';
    }

    const option = poll.options.find((option: any) => option.index === parseInt(index))

    if (!option) {
        throw 'Option not found';
    }

    const voted = await computeVoteByOptionId(option.id, ip);

    if (voted) {
        cookies().set(`poll-` + poll.id, option.index.toString(10) );
    }

    redirect(`/polls/${id}` + ((shouldClose !== undefined) ? '?close' : ''));
}
