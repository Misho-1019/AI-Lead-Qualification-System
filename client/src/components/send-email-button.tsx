'use client'

import { sendLeadEmail } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

type SendEmailButtonProps = {
    leadId: string;
    leadEmail: string;
    hasAnalysis: boolean;
}

export default function SendEmailButton({ leadId, leadEmail, hasAnalysis }: SendEmailButtonProps) {
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!hasAnalysis) {
            toast.error('No AI email generated yet');
            return;
        }

        const confirmed = window.confirm(`Send the AI-drafted email to ${leadEmail}?`);
        if (!confirmed) return;

        setIsSending(true);

        try {
            await sendLeadEmail(leadId);

            toast.success('Email sent successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to send email';
            toast.error(message);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <button
            onClick={handleSend}
            disabled={isSending || !hasAnalysis}
            className="gradient-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <span className="material-symbols-outlined text-base">send</span>
            {isSending ? 'Sending...' : 'Send email'}
        </button>
    );
}
