import { findOneById } from '@/models/poll';
import Link from "next/link";

type PollPageProps = {
    params: {
        id: string
    }
    searchParams: { [key: string]: string | string[] | undefined }
}

const BASE_URL = process.env.BASE_URL;
export default async function Page(props: PollPageProps) {
    const { params: {id}, searchParams } = props;
    const justCreated = searchParams.justcreated !== undefined;
    const close = searchParams.close !== undefined;

    const poll = await findOneById(id, true);

    const optionsList = poll.options.map(({index, title, votes}: any) => {
        return (
            <li key={index} >
                <Link href={`/polls/${poll.id}/vote?option=${index}`}>
                    <img src={`/api/polls/${poll.id}/options/${index}/img`} />
                </Link>
            </li>
        );
    })

    const markdownOptionsList = poll.options.map(({index, title, votes}: any) => {
        return `<a href="${BASE_URL}/polls/${poll.id}/vote?option=${index}&close" target="_blank">
  <img src="${BASE_URL}/api/polls/${poll.id}/options/${index}/img" alt="${title}"/>
</a>`
    }).join(`\n\n`);

    const markdown = `
${poll.title}

Choose one option:

${markdownOptionsList}`

    return (<>
        <h1>{poll.title}</h1>
        <ul>
            {optionsList}
        </ul>
        {/* if close flag was sent, we try to close the popup tab */}
        {close &&
            <script type="text/javascript">window.close();</script>
        }
        <pre>
            {markdown}
        </pre>
    </>)
}
