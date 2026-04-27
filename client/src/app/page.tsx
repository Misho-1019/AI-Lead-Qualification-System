import AutoRefresh from "@/components/auto-refresh";
import LeadsDashboard from "@/components/leads-dashboard";
import Link from "next/link";

type LeadAnalysis = {
    id: string;
    lead_id: string;
    score: number;
    priority: string;
    summary: string;
    qualification_reason: string;
    outreach_email_subject: string;
    outreach_email_body: string;
    recommended_next_step: string;
    created_at: string;
};

type Lead = {
    id: string;
    full_name: string;
    email: string;
    company: string | null;
    role: string | null;
    website: string | null;
    industry: string | null;
    company_size: string | null;
    budget_range: string | null;
    source: string | null;
    pain_point: string | null;
    notes: string | null;
    status: string;
    created_at: string;
    analysis?: LeadAnalysis | null;
}

async function getLeads(): Promise<Lead[]> {
    const response = await fetch('http://localhost:3030/api/leads', {
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch leads')
    }

    const result = await response.json();
    return result.data;
}

export default async function Home() {
    const leads = await getLeads();

    const totalLeads = leads.length;

    const analyzedLeads = leads.filter(lead => lead.analysis).length;

    const highPriorityLeads = leads.filter(
        lead => lead.analysis?.priority === 'high'
    ).length;

    const scoredLeads = leads.filter(
        lead => typeof lead.analysis?.score === 'number'
    )

    const averageScore = scoredLeads.length > 0
        ? Math.round(scoredLeads.reduce((sum, lead) => sum + (lead.analysis?.score ?? 0), 0) / scoredLeads.length)
        : 0;
    
    
    return (
        <main className="min-h-screen bg-slate-50">
            <AutoRefresh />

            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            AI Lead Qualification Dashboard
                        </h1>
                        <p className="mt-2 text-slate-600">
                            View inbound leads, qualification scores, and AI-generated outreach.
                        </p>
                    </div>
                
                    <Link
                        href="/leads/new"
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        + New Lead
                    </Link>
                </div>

                <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Total Leads</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{totalLeads}</p>
                    </div>
                
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Analyzed Leads</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{analyzedLeads}</p>
                    </div>
                
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">High Priority</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{highPriorityLeads}</p>
                    </div>
                
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Average AI Score</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{averageScore}</p>
                    </div>
                </div>

                <LeadsDashboard leads={leads} />
            </div>
        </main>
    );
}