import Form from "@/app/polls/create/form";
import Header from "@/ui/header";

export default function Page() {
    return (
      <>
        <Header/>
        <div className="mt-[90px]">
            <h1>Create your Poll</h1>
            <h2>Takes just one minute to create a poll!</h2>
            <Form/>
        </div>
      </>
    )
}
