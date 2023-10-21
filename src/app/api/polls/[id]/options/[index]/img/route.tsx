import {createCanvas} from "canvas";
import {NextRequest, NextResponse} from "next/server";
import {findOneById, PollOption} from '@/models/poll';

type PollOptionImageProps = {
    params: {
        id: string;
        index: string;
    }
}
export async function GET(request: NextRequest, { params: {id, index} }: PollOptionImageProps) {
    const poll = await findOneById(id, true);
    const option = poll.options.find((option: any) => option.index === parseInt(index))

    if (!option) {
        return new NextResponse('Option not found.', {status: 404})
    }

    const totalVotes = poll.options.reduce((acc: number, current: PollOption) => acc + (current.votes ?? 0), 0)

    const optionVotes = option.votes ?? 0;
    const percentage = optionVotes ? Math.round(100*(optionVotes / totalVotes)) : 0;

    const text = `${option.title} (${percentage}%)`;

    const canvas = createCanvas(250, 34);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#EEEEEE'
    ctx.fillRect(0, 0, 250, 34);

    ctx.fillStyle = '#9999CC';
    ctx.fillRect(0, 0, (optionVotes / totalVotes) * 250, 34);

    ctx.fillStyle = 'black';
    ctx.font = '16px Helvetica';
    ctx.fillText(text, 8, 22);

    const buffer = canvas.toBuffer('image/png');

    const response = new NextResponse(buffer, {})
    response.headers.set('content-type', 'image/png');

    return response;
}
