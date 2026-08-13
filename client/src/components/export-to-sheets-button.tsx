'use client'

import { exportLeadsToSheets } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ExportToSheetsButton() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const result = await exportLeadsToSheets();

            toast.success(result?.message ?? 'Leads exported to Google Sheets');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to export leads';
            toast.error(message);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <span className="material-symbols-outlined text-base">table_chart</span>
            {isExporting ? 'Exporting...' : 'Export to Sheets'}
        </button>
    );
}
