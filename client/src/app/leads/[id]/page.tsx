import Link from "next/link";
import StatusSelect from "@/components/status-select";
import ReanalyzeButton from "@/components/reanalyze-button";

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
}

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

async function getLead(id: string): Promise<Lead> {
    const response = await fetch(`http://localhost:3030/api/leads/${id}`, {
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch lead');
    }

    const result = await response.json();

    return result.data;
}

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    const lead = await getLead(id);

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        ← Back to dashboard
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            {lead.full_name}
                        </h1>
                        <p className="mt-2 text-slate-600">{lead.email}</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {lead.company ?? 'No company'} · {lead.industry ?? 'No industry'}
                        </p>

                        <div className="mt-4">
                            <ReanalyzeButton leadId={lead.id} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <StatusSelect leadId={lead.id} initialStatus={lead.status} />
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                AI Score
                            </p>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {lead.analysis?.score ?? 'Not analyzed yet'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Company Size
                            </p>
                            <p className="mt-2 text-slate-900">
                                {lead.company_size ?? 'N/A'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Budget Range
                            </p>
                            <p className="mt-2 text-slate-900">
                                {lead.budget_range ?? 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6">
                        <div className="rounded-xl bg-slate-50 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Pain Point
                            </h2>
                            <p className="mt-2 text-slate-700">
                                {lead.pain_point ?? 'No pain point provided.'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                AI Summary
                            </h2>
                            <p className="mt-2 leading-7 text-slate-700">
                                {lead.analysis?.summary ?? 'No analysis available yet.'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Qualification Reason
                            </h2>
                            <p className="mt-2 leading-7 text-slate-700">
                                {lead.analysis?.qualification_reason ?? 'No qualification reason available yet.'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Outreach Email Subject
                            </h2>
                            <p className="mt-2 text-slate-700">
                                {lead.analysis?.outreach_email_subject ?? 'No outreach subject available yet.'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Outreach Email Body
                            </h2>
                            <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                                {lead.analysis?.outreach_email_body ?? 'No outreach email generated yet.'}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Recommended Next Step
                            </h2>
                            <p className="mt-2 text-slate-700">
                                {lead.analysis?.recommended_next_step ?? 'No recommendation available yet.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}