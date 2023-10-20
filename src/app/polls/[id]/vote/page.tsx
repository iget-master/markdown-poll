import {computeVoteByOptionId, findOneById} from "@/models/poll";
import {ValidationError} from "@/infra/errors";
import {redirect} from "next/navigation";

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

    if (!optionIndex?.match(/^\d+$/)) {
        // @todo: throw a correct error
        throw 'Invalid option index';
    }
    const option = poll.options.find((option: any) => option.index === parseInt(optionIndex))

    if (!option) {
        return (<>Option not found.</>)
    }

    await computeVoteByOptionId(option.id);

    redirect(`/polls/${id}` + ((shouldClose !== undefined) ? '?close' : ''));
}
