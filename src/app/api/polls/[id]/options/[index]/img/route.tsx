import {createCanvas, loadImage} from "canvas";
import {NextRequest, NextResponse} from "next/server";
import {findOneById, PollOption} from '@/models/poll';
import {cookies} from "next/headers";
import validateColor, { validateHTMLColorHex } from 'validate-color';

type PollOptionImageProps = {
    params: {
        id: string;
        index: string;
    }
}

const DPI_SCALE = 2;
const CHECK_ICON = "PHN2ZyB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgZmlsbD0iIzRiZDM3YiIgcj0iMzAiLz48cGF0aCBkPSJtNDYgMTQtMjEgMjEuNi03LTcuMi03IDcuMiAxNCAxNC40IDI4LTI4Ljh6IiBmaWxsPSIjZmZmIi8+PC9zdmc+";
const ICON_SIZE = 24 * DPI_SCALE;
const ICON_MARGIN = 4;
const WIDTH = 300 * DPI_SCALE;
const HEIGHT = 34 * DPI_SCALE;
const TEXT_MARGIN = 4 * DPI_SCALE;
const MAX_TEXT_SIZE = (HEIGHT - (2 * TEXT_MARGIN)) * DPI_SCALE;

const DEFAULT_THEME = {
    bg: '#e0f2fe',
    fg: '#0ea5e9',
    text: 'black',
    textSize: 16
}

function parseTheme(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const getColorParam = (name: string, fallback: string) => {
        let value = searchParams.get(name);

        const hexPattern = /^([0-9A-F]{3}){1,2}$/i;
        if (value?.match(hexPattern)) {
            value = `#${value}`;
        }

        return (value && validateColor(value)) ? value : fallback
    }

    const getSizeParam = (name: string, min = 0, max = Infinity, fallback: number) => {
        const value = searchParams.get(name);

        if (value?.match(/^\d+$/)) {
            return Math.min(Math.max(min, parseInt(value)), max);
        } else {
            return fallback;
        }
    }

    return {
        bg: getColorParam('bg', DEFAULT_THEME.bg),
        fg: getColorParam('fg', DEFAULT_THEME.fg),
        text: getColorParam('text', DEFAULT_THEME.text),
        textSize: getSizeParam('textSize', 8, MAX_TEXT_SIZE, DEFAULT_THEME.textSize)
    }
}

export async function GET(request: NextRequest, { params: {id, index} }: PollOptionImageProps) {
    const styles = parseTheme(request);
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

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = styles.bg
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = styles.fg;
    ctx.fillRect(0, 0, (optionVotes / totalVotes) * WIDTH, HEIGHT);

    ctx.fillStyle = styles.text;
    ctx.font = styles.textSize * 2 + 'px Helvetica';
    ctx.fillText(text, 8, ((HEIGHT + styles.textSize) / 2), 250 * 2);

    if (voted) {
        const image = await loadImage(`data:image/png;base64,${CHECK_ICON}`);
        ctx.drawImage(image, WIDTH - ICON_SIZE - ICON_MARGIN, (HEIGHT - ICON_SIZE) / 2, ICON_SIZE, ICON_SIZE);
    }

    const buffer = canvas.toBuffer('image/png');

    const response = new NextResponse(buffer, {})
    response.headers.set('content-type', 'image/png');

    return response;
}
