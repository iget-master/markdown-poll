'use client'

import {ChangeEvent, FormEvent, useCallback, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./form.module.css"
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

const validateString = ((value: string) => (value.length >= 1) && (value.length <= 255));
export default function Form() {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState({
        title: '',
        options: ['', '']
    });

    const router = useRouter();

    const valid = useMemo(() => {
        return validateString(value.title) && value.options.every(validateString)
    }, [value]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name.startsWith('option-')) {
            setValue((prev) => {
                const index = parseInt(name.split('-')[1]);
                const options = [...prev.options];
                options[index] = value;

                return {
                    title: prev.title,
                    options: options
                }
            })
        } else if (name === 'title') {
            setValue((prev) => {
                return {
                    ...prev,
                    title: value,
                }
            })
        }
    }, [])

    const submitHandler = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);
        const response = await fetch('/api/polls', {
            method: 'POST',
            body: JSON.stringify(value),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const poll = await response.json();

        router.push(`/polls/${poll.id}?justcreated`);
    }, [loading, router, value])

    const addOption = () => {
        setValue((prev) => {
            return {
                ...prev,
                options: [...prev.options, '']
            }
        });
    }

    const removeOption = (index: number) => {
        setValue((prev) => {
            const options = [...prev.options]
            options.splice(index, 1);
            return {...prev, options}
        })
    }

    const optionsList = useMemo(() => value.options.map((option, index) => {
        return (
            <div key={index} className={styles.inputWrapper}>
                <span className="flex select-none items-center pl-3 text-slate-700 dark:text-slate-100 sm:text-sm mr-1">{index + 1}.</span>
                <input
                    type="text"
                    name={"option-" + index}
                    id={"option-" + index}
                    onChange={handleChange}
                    value={value.options[index]}
                    placeholder={'Enter your option label'}
                />
                {(index > 1) &&
                    <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="inline-flex items-center rounded-full self-center mr-1 bg-red-500 p-1 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                    >
                        <XMarkIcon className="h-5 w-5"/>
                        <span className="hidden sm:inline pr-1">Remove</span>
                    </button>
                }
            </div>
        )
    }), [value])


    return (
        <form onSubmit={submitHandler}>
            <div className={styles.formBody}>
                <div className="col-span-full">
                    <label htmlFor="title" className={styles.label}>
                        Poll question
                    </label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            onChange={handleChange}
                            value={value.title}
                            placeholder="Which ice cream do you prefer?"
                        />
                    </div>
                </div>
                <div className="col-span-full">
                    <label htmlFor="title" className={styles.label}>
                        Options
                    </label>
                    {optionsList}
                    <button
                        type="button"
                        onClick={addOption}
                        className="inline-flex items-center mt-3 rounded bg-white/10 ring-1 ring-slate-300 px-2 py-1 text-xs font-semibold dark:text-white shadow-md hover:bg-white/20"
                    >
                        <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Add option
                    </button>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="submit"
                    disabled={!valid || loading}
                    className={"inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " + ((valid && !loading) ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 text-white' : 'bg-slate-400 text-white')}
                >
                    { loading && (<>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>
                            Creating
                        </span>
                    </>)}
                    { !loading && (
                        <span>Create</span>
                    )}
                </button>
            </div>
        </form>
    )
}
