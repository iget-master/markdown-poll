import Image from 'next/image'
import { redirect } from 'next/navigation'
import Header from "@/ui/header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header/>
      <div className="flex flex-wrap mt-[90px]">
        <div className="text-center w-full">
          <h1 className="text-5xl md:text-6xl font-bold leading-snug">
            Add interactivity to your Markdown!
          </h1>
          <h2 className="text-2xl mt-4">
            Create Polls to <u>interact with your audience</u> in just one minute!
          </h2>
        </div>
        <div className="flex flex-col w-full  text-center flex items-center justify-center mt-10">
          <Image
            src={'/demo.webp'}
            alt="Example of poll with Markdown Poll"
            height={240}
            width={328}
            className="shadow-xl shadow-purple-100"
          />
          <Link
            href="/polls/create"
            className="rounded mt-4 mb-2 bg-indigo-500 px-6 py-2 text-3xl font-bold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Create your poll!
          </Link>
          <h3 className="text-xl">Takes only one minute to create your first poll</h3>
          <h4>* No signup required!</h4>
        </div>
      </div>
    </>
  )
}
