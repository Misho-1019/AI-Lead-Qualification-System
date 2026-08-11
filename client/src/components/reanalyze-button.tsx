'use client'

import { reanalyzeLead } from "@/lib/api";
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
            await reanalyzeLead(leadId);

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
            className="gradient-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isLoading ? 'Re-analyzing...' : 'Re-run AI Analysis'}
        </button>
    );
}
