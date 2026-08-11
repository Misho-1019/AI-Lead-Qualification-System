'use client'

import { useState } from "react";
import toast from "react-hot-toast";

type CopyEmailButtonProps = {
    subject: string;
    body: string;
}

export default function CopyEmailButton({ subject, body }: CopyEmailButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
            setCopied(true);
            toast.success('Email copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy email');
        }
    }

    const disabled = !subject && !body;

    return (
        <button
            onClick={handleCopy}
            disabled={disabled}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {copied ? 'Copied ✓' : 'Copy email'}
        </button>
    );
}
