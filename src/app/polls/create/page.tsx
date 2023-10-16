'use client'

import {useMemo, useState} from "react";

export default function Page() {
    const [options, setOptions] = useState(['', ''])

    const add = () => {
        setOptions((options) => {
            return [
                ...options,
                ''
            ]
        });
    }

    const remove = (index: number) => {
        setOptions((options) => {
           return options.splice(index, 1)
        });
    }

    const optionsList = useMemo(() => options.map((option, index) => {
        return (
            <div key={index} className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md mb-2">

                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm mr-1">{index + 1}.</span>
                <input
                    type="text"
                    name={"option-" + index}
                    id={"option-" + index}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={'Enter your option label'}
                />
                {(index > 1) &&
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-700 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Remove
                </button>
                }
            </div>
        )
    }), [options])

    return (
        <form>
            <div className="space-y-12 py-2">
                <div className="border-b border-gray-900/10 pb-12">
                    <h1 className="text-base font-semibold leading-7 text-gray-900">Create your Poll</h1>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        It&apos;s easy and fast to create a Markdown Poll. Just fill the form bellow, save and
                        receive necessary markdown to embed your poll.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                Poll question
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="which ice cream do you prefer?"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                Poll Options
                            </label>
                            <div className="mt-2">
                                {optionsList}
                            </div>
                            <button
                                type="button"
                                onClick={add}
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Add option
                            </button>
                            <p className="mt-3 text-sm leading-6 text-gray-600">Add up to 5 options to your poll.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
