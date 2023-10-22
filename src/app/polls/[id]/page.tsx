import { findOneById } from '@/models/poll';
import Link from "next/link";
import CopyButton from "@/ui/copy-button";
export const dynamic = 'force-dynamic'

type PollPageProps = {
    params: {
        id: string
    }
    searchParams: { [key: string]: string | string[] | undefined },
}

const BASE_URL = process.env.BASE_URL;
export default async function Page(props: PollPageProps) {
    const { params: {id}, searchParams } = props;
    const justCreated = searchParams.justcreated !== undefined;
    const close = searchParams.close !== undefined;

    const poll = await findOneById(id, true);

    const optionsList = poll.options.map(({index, title, votes}: any) => {
        return (
            <li key={index} className={"mb-1"} >
                <Link href={`/api/polls/${poll.id}/options/${index}/vote`}>
                    <img src={`/api/polls/${poll.id}/options/${index}/img`} />
                </Link>
            </li>
        );
    })

    const markdownOptionsList = poll.options.map(({index, title, votes}: any) => {
        return `<a href="${BASE_URL}/api/polls/${poll.id}/options/${index}/vote?close" target="_blank">
  <img src="${BASE_URL}/api/polls/${poll.id}/options/${index}/img" alt="${title}"/>
</a>`
    }).join(`\n<br/>\n`);

    const markdown = `${poll.title}

${markdownOptionsList}
<br/>
<small>Click on the option you want to vote.</small><br/><small>Poll created with <a href="${BASE_URL}">md-poll</a></small>`

    return (<>

        <h2 className={"pt-4 mb-1 text-xl font-medium"}>Poll preview</h2>
        <h3 className={"mb-2"}>Your poll will show like this on markdown: </h3>
        <blockquote className={"ml-2 p-2 bg-slate-100 dark:bg-slate-600"}>
            <h2>{poll.title}</h2>
            <ul>
                {optionsList}
            </ul>
            <small>Click on the option you want to vote.</small>
            <br/>
            <small>Poll created with <a href={BASE_URL}>md-poll</a></small>
        </blockquote>

        {/* if close flag was sent, we try to close the popup tab */}
        {close &&
            <script type="text/javascript">window.close();</script>
        }

        <h2 className={"pt-4 pb-1 text-xl font-medium"}>
            Copy and paste this html into your markdown
        </h2>

        <CopyButton text={markdown}/>

        <pre id="markdown" className={"ml-2 p-2 bg-slate-100 dark:bg-slate-600 overflow-x-scroll"}>
            {markdown}
        </pre>
    </>)
}
