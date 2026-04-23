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

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        AI Lead Qualification Dashboard
                    </h1>
                    <p className="mt-2 text-slate-600">
                        View inbound leads, qualification scores, and AI-generated outreach.
                    </p>
                </div>

                <div className="grid gap-4">
                    {leads.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-slate-700">No leads found.</p>
                        </div>
                    ) : (
                        leads.map((lead) => (
                            <div
                                key={lead.id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
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

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                        {lead.status}
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-2 text-sm text-slate-700">
                                    <p>
                                        <span className="font-medium">Pain point:</span>{' '}
                                        {lead.pain_point ?? 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Budget:</span>{' '}
                                        {lead.budget_range ?? 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium">AI score:</span>{' '}
                                        {lead.analysis?.score ?? 'Not analyzed yet'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Priority:</span>{' '}
                                        {lead.analysis?.priority ?? 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}