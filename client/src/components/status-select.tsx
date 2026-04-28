'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type StatusSelectProps = {
    leadId: string;
    initialStatus: string;
}

export default function StatusSelect({ leadId, initialStatus }: StatusSelectProps) {
    const router = useRouter();

    const [status, setStatus] = useState(initialStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (newStatus: string) => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        if (!API_BASE_URL) {
            toast.error('API URL not configured');
            return;
        }

        setStatus(newStatus)
        setIsUpdating(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

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

    return (
        <div>
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
            </label>

            <select
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                disabled={isUpdating}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
    );
}