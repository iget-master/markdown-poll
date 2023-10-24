import {computeVoteByOptionId, findOneById} from "@/models/poll";
import {redirect} from "next/navigation";
import {headers} from 'next/headers'

type PollVotePageProps = {
    params: {
        id: string
    },
    searchParams: {
        option: string|undefined
        close: string|undefined
    }
}
export default async function Page({params: {id}, searchParams: {option: optionIndex, close: shouldClose}}: PollVotePageProps) {
    const poll = await findOneById(id);
    const ip = headers().get('x-forwarded-for');
    if (!optionIndex?.match(/^\d+$/)) {
        // @todo: throw a correct error
        throw 'Invalid option index';
    }
    const option = poll.options.find((option: any) => option.index === parseInt(optionIndex))

    if (!option) {
        return (<>Option not found.</>)
    }

    const voted = await computeVoteByOptionId(option.id, ip);

    redirect(`/polls/${id}` + ((shouldClose !== undefined) ? '?close' : ''));
}
