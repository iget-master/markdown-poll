import { findOneById } from '@/models/poll';
import Link from "next/link";

type PollPageProps = {
    params: {
        id: string
    }
    searchParams: { [key: string]: string | string[] | undefined }
}
export default async function Page(props: PollPageProps) {
    const { params: {id}, searchParams } = props;
    const justCreated = searchParams.justcreated !== undefined;
    const close = searchParams.close !== undefined;

    const poll = await findOneById(id, true);

    const optionsList = poll.options.map(({index, title, votes}: any) => {
        return (
            <li key={index} >
                <Link href={`/polls/${poll.id}/vote?option=${index}`}>
                    {index + 1}. {title} ({votes})
                </Link>
            </li>
        );
    })

    return (<>
        <h1>{poll.title}</h1>
        <ul>
            {optionsList}
        </ul>
        {/* if close flag was sent, we try to close the popup tab */}
        {close &&
            <script type="text/javascript">window.close();</script>
        }
    </>)
}
