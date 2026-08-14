import AutoRefresh from "@/components/auto-refresh";
import ExportToSheetsButton from "@/components/export-to-sheets-button";
import LeadsDashboard from "@/components/leads-dashboard";
import Link from "next/link";
import { getLeadStats, getLeads } from "@/lib/api";
import { Lead, LeadStats } from "@/types/lead";

export default async function Home() {
    let leads: Lead[] = [];
    let stats: LeadStats = { total: 0, analyzed: 0, highPriority: 0, averageScore: 0 };
    let apiUnavailable = false;

    try {
        const [l, s] = await Promise.all([getLeads(), getLeadStats()]);
        leads = l;
        stats = s;
    } catch {
        apiUnavailable = true;
    }

    const kpis = [
        { label: 'Total Leads', value: stats.total, highlight: true },
        { label: 'Analyzed Leads', value: stats.analyzed, highlight: false },
        { label: 'High Priority', value: stats.highPriority, highlight: false },
        { label: 'Average AI Score', value: stats.averageScore, highlight: false },
    ];

    return (
        <main className="min-h-screen font-body">
            <AutoRefresh />

            <div className="pointer-events-none fixed top-0 right-0 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px] mix-blend-screen animate-pulse-slow" />
            <div className="pointer-events-none fixed bottom-0 left-1/4 h-[600px] w-[600px] rounded-full bg-tertiary/5 blur-[100px] mix-blend-screen" />

            <div className="relative mx-auto max-w-[1600px] px-6 py-10 lg:px-12">
                <header className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            Live Feed
                        </div>
                        <h1 className="gradient-text font-headline text-4xl font-black tracking-tight lg:text-5xl">
                            Lead Intelligence
                        </h1>
                        <p className="mt-2 max-w-xl text-base font-medium text-on-surface/50">
                            Real-time algorithmic qualification and intent scoring.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/analytics"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-white/10"
                        >
                            <span className="material-symbols-outlined text-base">monitoring</span>
                            Analytics
                        </Link>

                        <ExportToSheetsButton />

                        <Link
                            href="/leads/new"
                            className="gradient-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform hover:scale-105 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            New Lead
                        </Link>
                    </div>
                </header>

                {apiUnavailable && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-medium text-amber-300">
                        <span className="material-symbols-outlined text-lg">cloud_off</span>
                        Backend is currently unavailable — please try again in a moment.
                    </div>
                )}

                <div className="mb-10 grid gap-4 md:grid-cols-4">
                    {kpis.map((kpi) => (
                        <div key={kpi.label} className="glass-card rounded-2xl p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                                {kpi.label}
                            </p>
                            <p
                                className={`mt-2 font-headline text-3xl font-black ${
                                    kpi.highlight ? 'text-primary' : 'text-on-surface'
                                }`}
                            >
                                {apiUnavailable ? '—' : kpi.value}
                            </p>
                        </div>
                    ))}
                </div>

                <LeadsDashboard leads={leads} isUnavailable={apiUnavailable} />
            </div>
        </main>
    );
}
