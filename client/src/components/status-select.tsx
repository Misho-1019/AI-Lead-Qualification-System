'use client'

import { updateLeadStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type StatusSelectProps = {
    leadId: string;
    initialStatus: string;
}

const STATUS_STYLES: Record<string, { select: string; dot: string }> = {
    new: { select: 'border-slate-500/20 bg-slate-500/10 text-slate-400', dot: 'bg-slate-400' },
    contacted: { select: 'border-blue-500/20 bg-blue-500/10 text-blue-400', dot: 'bg-blue-400' },
    qualified: { select: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' },
    rejected: { select: 'border-rose-500/20 bg-rose-500/10 text-rose-400', dot: 'bg-rose-400' },
};

export default function StatusSelect({ leadId, initialStatus }: StatusSelectProps) {
    const router = useRouter();

    const [status, setStatus] = useState(initialStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (newStatus: string) => {
        setStatus(newStatus)
        setIsUpdating(true);

        try {
            await updateLeadStatus(leadId, newStatus)

            toast.success('Lead status updated')
            router.refresh();
        } catch (error) {
            console.error(error);
            setStatus(initialStatus)
            toast.error('Failed to update lead status')
        } finally {
            setIsUpdating(false)
        }
    }

    const style = STATUS_STYLES[status] ?? STATUS_STYLES.new;

    return (
        <div className="relative">
            <label className="sr-only">Status</label>
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                <span className={`block h-2 w-2 animate-pulse rounded-full ${style.dot}`} />
            </span>
            <select
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                disabled={isUpdating}
                className={`w-full appearance-none rounded-full border py-2.5 pl-8 pr-4 text-sm font-bold outline-none backdrop-blur-sm transition focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60 ${style.select} [&>option]:bg-surface-container`}
            >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
    );
}
