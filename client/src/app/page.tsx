import AutoRefresh from "@/components/auto-refresh";
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

function getPriorityClasses(priority?: string | null) {
    switch (priority) {
        case 'high':
            return 'bg-red-50 text-red-700 border border-red-200';
        case 'medium':
            return 'bg-amber-50 text-amber-700 border border-amber-200';
        case 'low':
            return 'bg-green-50 text-green-700 border border-green-200';
        default:
            return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
}

function getStatusClasses(status: string) {
    switch (status) {
        case 'qualified':
            return 'bg-green-50 text-green-700 border border-green-200';
        case 'contacted':
            return 'bg-blue-50 text-blue-700 border border-blue-200';
        case 'rejected':
            return 'bg-red-50 text-red-700 border border-red-200';
        default:
            return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
}

export default async function Home() {
    const leads = await getLeads();

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

                {leads.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-slate-700">No leads found.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {leads.map((lead) => (
                            <Link
                                key={lead.id}
                                    href={`/leads/${lead.id}`}
                                    className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {lead.full_name}
                                        </h2>
                                        <p className="text-slate-600">{lead.email}</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {lead.company ?? 'No company'} · {lead.industry ?? 'No industry'}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                            lead.status
                                        )}`}
                                    >
                                        {lead.status}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            AI Score
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {lead.analysis?.score ?? '--'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Priority
                                        </p>
                                        <div className="mt-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityClasses(
                                                    lead.analysis?.priority
                                                )}`}
                                            >
                                                {lead.analysis ? lead.analysis.priority : 'Analyzing'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2 text-sm text-slate-700">
                                    <p>
                                        <span className="font-medium text-slate-900">Pain point:</span>{' '}
                                        {lead.pain_point ?? 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-slate-900">Budget:</span>{' '}
                                        {lead.budget_range ?? 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-slate-900">Company size:</span>{' '}
                                        {lead.company_size ?? 'N/A'}
                                    </p>
                                </div>

                                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        AI Summary
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                        {lead.analysis ? lead.analysis.summary : 'AI is analyzing this lead...'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}