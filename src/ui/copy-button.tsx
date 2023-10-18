'use client'

import {ClipboardDocumentIcon} from "@heroicons/react/24/solid";

export type CopyButtonProps = {
    text: string;
}
export default function CopyButton({ text }: CopyButtonProps) {
    const copy = async () => {
        await navigator.clipboard.writeText(text)
    }

    return (<button
        id="copyToClipboardButton"
        type="button"
        onClick={copy}
        className="rounded bg-indigo-600 ml-2 mb-2 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
        <ClipboardDocumentIcon className="inline mx-auto h-4 w-4 mr-1 text-white" aria-hidden="true" />
        Copy to Clipboard
    </button>)
}
