'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type ReanalyzeButtonProps = {
    leadId: string;
}

export default function ReanalyzeButton({ leadId }: ReanalyzeButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        
        try {
            const response = await fetch(`http://localhost:3030/api/leads/${leadId}/reanalyze`, {
                method: 'POST'
            })

            if (!response.ok) {
                throw new Error('Failed to trigger reanalysis')
            }

            toast.success('AI reanalysis triggered')
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to trigger AI reanalysis')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isLoading ? 'Re-analyzing...' : 'Re-run AI Analysis'}
        </button>
    );
}