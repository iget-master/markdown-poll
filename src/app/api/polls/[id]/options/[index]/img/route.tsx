import {createCanvas, loadImage} from "canvas";
import {NextRequest, NextResponse} from "next/server";
import {findOneById, PollOption} from '@/models/poll';
import {cookies} from "next/headers";

type PollOptionImageProps = {
    params: {
        id: string;
        index: string;
    }
}

const checkIcon = "PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgZmlsbD0iIzRiZDM3YiIgcj0iMzAiLz48cGF0aCBkPSJtNDYgMTQtMjEgMjEuNi03LTcuMi03IDcuMiAxNCAxNC40IDI4LTI4Ljh6IiBmaWxsPSIjZmZmIi8+PC9zdmc+";

export async function GET(request: NextRequest, { params: {id, index} }: PollOptionImageProps) {
    const poll = await findOneById(id, true);
    const option = poll.options.find((option: any) => option.index === parseInt(index))

    if (!option) {
        return new NextResponse('Option not found.', {status: 404})
    }

    const votedOption = cookies().get(`poll-${id}`);
    const voted = votedOption && votedOption.value === index;

    const totalVotes = poll.options.reduce((acc: number, current: PollOption) => acc + (current.votes ?? 0), 0)

    const optionVotes = option.votes ?? 0;
    const percentage = optionVotes ? Math.round(100*(optionVotes / totalVotes)) : 0;

    const text = `${option.title} - ${percentage}%`;

    const canvas = createCanvas(300, 34);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e0f2fe'
    ctx.fillRect(0, 0, 300, 34);

    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(0, 0, (optionVotes / totalVotes) * 300, 34);

    ctx.fillStyle = 'black';
    ctx.font = '16px Helvetica';
    ctx.fillText(text, 8, 22, 250);

    if (voted) {
        const image = await loadImage(`data:image/png;base64,${checkIcon}`);
        ctx.drawImage(image, 300-28, 5, 24, 24);
    }

    const buffer = canvas.toBuffer('image/png');

    const response = new NextResponse(buffer, {})
    response.headers.set('content-type', 'image/png');

    return response;
}
