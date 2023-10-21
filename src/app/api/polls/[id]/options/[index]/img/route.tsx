import { PollOption, findOneById } from '@/models/poll';
import { createCanvas } from 'canvas';
import { NextRequest, NextResponse } from 'next/server';
import { getPollImageProperties } from './properties';

type PollOptionImageProps = {
  params: {
    id: string;
    index: string;
  };
};

export async function GET(
  request: NextRequest,
  { params: { id, index }, }: PollOptionImageProps
) {
  const poll = await findOneById(id, true);
  const option = poll.options.find(
    (option: any) => option.index === parseInt(index)
  );

  if (!option) {
    return new NextResponse('Option not found.', { status: 404 });
  }

  const totalVotes = poll.options.reduce(
    (acc: number, current: PollOption) => acc + (current.votes ?? 0),
    0
  );

  const optionVotes = option.votes ?? 0;
  const percentage = optionVotes
    ? Math.round(100 * (optionVotes / totalVotes))
    : 0;

  const text = `${option.title} (${percentage}%)`;

  const canvas = createCanvas(250, 34);
  const ctx = canvas.getContext('2d');

  const { background, backgroundFilled, color, fontSize } =
    getPollImageProperties(request);

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 200, 34);

  ctx.fillStyle = backgroundFilled;
  ctx.fillRect(0, 0, (optionVotes / totalVotes) * 200, 34);

  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Helvetica`;
  ctx.fillText(text, 8, 22);

  const buffer = canvas.toBuffer('image/png');

  const response = new NextResponse(buffer, {});
  response.headers.set('content-type', 'image/png');

  return response;
}

