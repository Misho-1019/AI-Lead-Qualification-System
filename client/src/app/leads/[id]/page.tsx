import Link from "next/link";
import { notFound } from "next/navigation";
import CopyEmailButton from "@/components/copy-email-button";
import ReanalyzeButton from "@/components/reanalyze-button";
import StatusSelect from "@/components/status-select";
import { getLead } from "@/lib/api";

function ScoreRing({ score }: { score: number | null }) {
    const color = '#6366f1';
    const deg = score != null ? Math.round((score / 100) * 360) : 0;

    return (
        <div
            className="relative flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.06) ${deg}deg)` }}
        >
            <div className="absolute inset-[4px] rounded-full" style={{ background: '#10121e' }} />
            <span className="relative z-[1] font-headline text-lg font-black text-primary">
                {score ?? '—'}
            </span>
        </div>
    );
}

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    const lead = await getLead(id);

    if (!lead) {
        notFound();
    }

    const score = lead.analysis?.score ?? null;
    const priority = lead.analysis?.priority ?? null;

    const priorityMeta =
        priority === 'high'
            ? { chip: 'border-rose-500/20 bg-rose-500/10 text-rose-400', label: 'High' }
            : priority === 'medium'
              ? { chip: 'border-amber-500/20 bg-amber-500/10 text-amber-400', label: 'Medium' }
              : priority === 'low'
                ? { chip: 'border-slate-500/20 bg-slate-500/10 text-slate-400', label: 'Low' }
                : { chip: 'border-slate-500/20 bg-slate-500/10 text-slate-500', label: 'Analyzing' };

    const companyLine = [lead.company, lead.role ?? lead.industry].filter(Boolean).join(' • ') || 'No company';

    return (
        <main className="min-h-screen font-body">
            <div className="pointer-events-none fixed top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
            <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-secondary/10 blur-[150px]" />

            <div className="relative mx-auto max-w-5xl px-6 py-10">
                <nav className="mb-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-on-surface/60 transition-colors hover:text-primary"
                    >
                        ← Back to dashboard
                    </Link>
                </nav>

                <header className="glass-card relative mb-8 overflow-hidden rounded-3xl p-8">
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="gradient-text font-headline text-3xl font-black tracking-tight lg:text-4xl">
                                {lead.full_name}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-base text-on-surface/60">
                                <span>{lead.email}</span>
                                <span className="h-1 w-1 rounded-full bg-on-surface/30" />
                                <span
                                    className={
                                        priority === 'high'
                                            ? 'inline-flex items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-sm font-semibold text-rose-400'
                                            : 'font-semibold text-on-surface/80'
                                    }
                                >
                                    {companyLine}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <StatusSelect leadId={lead.id} initialStatus={lead.status} />
                            <ReanalyzeButton leadId={lead.id} />
                        </div>
                    </div>
                </header>

                <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="glass-card flex flex-col gap-2 rounded-2xl p-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                            AI Score
                        </span>
                        <ScoreRing score={score} />
                    </div>

                    <div className="glass-card flex flex-col gap-2 rounded-2xl p-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                            Priority
                        </span>
                        <span className={`mt-auto w-fit rounded-full border px-3 py-1 text-sm font-bold ${priorityMeta.chip}`}>
                            {priorityMeta.label}
                        </span>
                    </div>

                    <div className="glass-card flex flex-col gap-2 rounded-2xl p-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                            Company Size
                        </span>
                        <span className="mt-auto font-headline text-2xl font-black text-on-surface">
                            {lead.company_size ?? 'N/A'}
                        </span>
                    </div>

                    <div className="glass-card flex flex-col gap-2 rounded-2xl p-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                            Budget Range
                        </span>
                        <span className="mt-auto font-headline text-2xl font-black text-on-surface">
                            {lead.budget_range ?? 'N/A'}
                        </span>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="glass-card rounded-3xl p-6">
                        <h2 className="border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface/60">
                            Pain Point
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-on-surface">
                            {lead.pain_point ?? 'No pain point provided.'}
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-6 md:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                                AI Summary
                            </h2>
                            <span className="rounded border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                AI Insight
                            </span>
                        </div>
                        <p className="text-lg font-semibold leading-snug text-on-surface">
                            {lead.analysis?.summary ?? 'No analysis available yet.'}
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-6">
                        <h2 className="border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface/60">
                            Qualification Reason
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-on-surface/80">
                            {lead.analysis?.qualification_reason ?? 'No qualification reason available yet.'}
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-6 md:col-span-2">
                        <h2 className="border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider text-on-surface/60">
                            Recommended Next Step
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-on-surface">
                            {lead.analysis?.recommended_next_step ?? 'No recommendation available yet.'}
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-6 md:col-span-3">
                        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface/60">
                                AI Drafted Outreach Email
                            </h2>
                            <CopyEmailButton
                                subject={lead.analysis?.outreach_email_subject ?? ''}
                                body={lead.analysis?.outreach_email_body ?? ''}
                            />
                        </div>

                        {lead.analysis ? (
                            <>
                                <div className="mb-1 px-1 text-sm text-on-surface/60">Subject:</div>
                                <div className="mb-4 px-1 text-base font-semibold text-on-surface">
                                    {lead.analysis.outreach_email_subject}
                                </div>
                                <div className="whitespace-pre-line rounded-2xl border border-white/5 bg-surface-container/50 p-6 text-base leading-relaxed text-on-surface/80">
                                    {lead.analysis.outreach_email_body}
                                </div>
                            </>
                        ) : (
                            <p className="text-on-surface/60">No outreach email generated yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
