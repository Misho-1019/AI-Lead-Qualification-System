import Link from "next/link";
import AnalyticsCharts from "@/components/analytics-charts";
import { getAnalytics } from "@/lib/api";
import { AnalyticsOverview } from "@/types/lead";

export default async function AnalyticsPage() {
    let data: AnalyticsOverview = { scoreDistribution: [], priorityBreakdown: [], statusBreakdown: [], leadsOverTime: [] };
    let apiUnavailable = false;

    try {
        data = await getAnalytics();
    } catch {
        apiUnavailable = true;
    }

    return (
        <main className="min-h-screen font-body">
            <div className="pointer-events-none fixed top-0 right-0 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px] mix-blend-screen" />
            <div className="pointer-events-none fixed bottom-0 left-1/4 h-[600px] w-[600px] rounded-full bg-tertiary/5 blur-[100px] mix-blend-screen" />

            <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-12">
                <nav className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface/60 transition-colors hover:text-primary"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to dashboard
                    </Link>
                </nav>

                <header className="mb-10">
                    <h1 className="gradient-text font-headline text-4xl font-black tracking-tight lg:text-5xl">
                        Analytics
                    </h1>
                    <p className="mt-2 max-w-xl text-base font-medium text-on-surface/50">
                        Lead qualification performance at a glance.
                    </p>
                </header>

                {apiUnavailable && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-medium text-amber-300">
                        <span className="material-symbols-outlined text-lg">cloud_off</span>
                        Backend is currently unavailable — please try again in a moment.
                    </div>
                )}

                <AnalyticsCharts data={data} />
            </div>
        </main>
    );
}
