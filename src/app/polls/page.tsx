import {getStatistics} from "@/models/poll";

export default async function Page() {
    const {
        pollsCount,
        optionsCount,
        votesCount,
    } = await getStatistics()

    return (<>
        <h1 className="text-2xl font-bold mb-2">Statistics</h1>
        <ul>
            <li><strong>Polls created:</strong> {pollsCount}</li>
            <li><strong>Average options per poll:</strong> {optionsCount / pollsCount}</li>
            <li><strong>Averate votes per poll:</strong> {(votesCount / pollsCount).toPrecision(2)}</li>
            <li><strong>Total votes:</strong> {votesCount}</li>
        </ul>
    </>)
}
