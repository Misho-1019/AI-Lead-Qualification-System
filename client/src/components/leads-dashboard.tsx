'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Lead } from "@/types/lead";

type LeadsDashboardProps = {
    leads: Lead[];
    total: number;
    page: number;
    limit: number;
    search: string;
    status: string;
    sortBy: string;
    isUnavailable?: boolean;
}

const STATUS_TABS = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Rejected', value: 'rejected' },
];

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join('');
}

function getStatusPill(status: string): string {
    switch (status) {
        case 'qualified':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'contacted':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'rejected':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        default:
            return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
}

function getPriorityMeta(priority?: string | null) {
    switch (priority) {
        case 'high':
            return { color: '#f43f5e', glow: 'rgba(244,63,94,0.35)', text: 'text-rose-400', label: 'High priority' };
        case 'medium':
            return { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)', text: 'text-amber-400', label: 'Medium priority' };
        case 'low':
            return { color: '#64748b', glow: 'transparent', text: 'text-slate-400', label: 'Low priority' };
        default:
            return { color: '#334155', glow: 'transparent', text: 'text-slate-500', label: 'Analyzing' };
    }
}

function ScoreRing({ score, size, color, glow }: { score: number | null; size: number; color: string; glow: string }) {
    const deg = score != null ? Math.round((score / 100) * 360) : 0;

    return (
        <div
            className="relative flex shrink-0 items-center justify-center rounded-full"
            style={{
                width: size,
                height: size,
                background: `conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.05) ${deg}deg)`,
                boxShadow: `0 0 20px ${glow}`,
            }}
        >
            <div className="absolute inset-[6px] rounded-full" style={{ background: '#10121e' }} />
            <div className="relative z-[1] text-center">
                <div
                    className="font-headline font-black leading-none text-white"
                    style={{ fontSize: Math.max(16, size * 0.3) }}
                >
                    {score ?? '—'}
                </div>
            </div>
        </div>
    );
}

function LeadCard({ lead }: { lead: Lead }) {
    const score = lead.analysis?.score ?? null;
    const priority = lead.analysis?.priority ?? null;
    const priorityMeta = getPriorityMeta(priority);
    const dimmed = priority === 'low';

    const companyLine = [lead.company, lead.role ?? lead.industry].filter(Boolean).join(' • ') || 'No company';

    return (
        <Link
            href={`/leads/${lead.id}`}
            className={`masonry-item glass-card group relative block overflow-hidden rounded-3xl p-6 ${
                priority === 'high' ? 'border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]' : ''
            } ${dimmed ? 'opacity-70 hover:opacity-100' : ''}`}
        >
            {priority === 'high' && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent" />
            )}
            <div className="pointer-events-none absolute -top-0 -right-0 h-32 w-32 rounded-full bg-primary/20 blur-[50px] transition-colors group-hover:bg-primary/30" />

            <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${
                            priority === 'high' ? 'border-rose-500/30 bg-surface-container' : 'border-white/10 bg-surface-container'
                        } ${dimmed ? 'grayscale' : ''}`}
                    >
                        <span className="font-headline text-xl font-black text-on-surface/80">{getInitials(lead.full_name)}</span>
                    </div>
                    <div>
                        <h3 className="font-headline text-2xl font-black leading-none tracking-tight text-on-surface">
                            {lead.full_name}
                        </h3>
                        <p
                            className={`mt-1 text-sm font-medium ${
                                priority === 'high'
                                    ? 'text-rose-400'
                                    : priority === 'medium'
                                      ? 'text-amber-400'
                                      : priority === 'low'
                                        ? 'text-on-surface/40'
                                        : 'text-primary'
                            }`}
                        >
                            {companyLine}
                        </p>
                    </div>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-widest ${getStatusPill(lead.status)}`}>
                    {lead.status}
                </span>
            </div>

            <div className="relative mt-6 flex items-center gap-6">
                <ScoreRing score={score} size={score == null ? 72 : 80} color={priorityMeta.color} glow={priorityMeta.glow} />
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary">auto_awesome</span>
                        <span className={`text-xs font-black uppercase tracking-widest ${priorityMeta.text}`}>
                            AI Insight
                        </span>
                        {priority && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-on-surface/50">
                                {priorityMeta.label}
                            </span>
                        )}
                    </div>
                    <p className="text-sm leading-relaxed text-on-surface/80">
                        {lead.analysis ? lead.analysis.summary : 'AI is analyzing this lead...'}
                    </p>
                </div>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-black/20 p-4">
                <div>
                    <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                        Budget Range
                    </span>
                    <span className="text-lg font-bold text-on-surface">{lead.budget_range ?? 'N/A'}</span>
                </div>
                <div>
                    <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                        Company Size
                    </span>
                    <span className="text-lg font-bold text-on-surface">{lead.company_size ?? 'N/A'}</span>
                </div>
            </div>

            <div className="relative mt-4 rounded-xl bg-black/20 p-4">
                <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-on-surface/40">
                    Pain Point
                </span>
                <p className="text-sm text-on-surface/70">{lead.pain_point ?? 'No pain point provided.'}</p>
            </div>

            <div
                className={`relative mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-bold transition-all active:scale-[0.98] ${
                    priority === 'high'
                        ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:bg-rose-600'
                        : 'bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:bg-primary/90'
                }`}
            >
                View Details
                <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
        </Link>
    );
}

export default function LeadsDashboard({
    leads,
    total,
    page,
    limit,
    search,
    status,
    sortBy,
    isUnavailable = false,
}: LeadsDashboardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [searchValue, setSearchValue] = useState(search);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const navigate = (updates: { search?: string; status?: string; sortBy?: string; page?: number }) => {
        const next = {
            search: updates.search ?? search,
            status: updates.status ?? status,
            sortBy: updates.sortBy ?? sortBy,
            page: updates.page ?? page,
        };

        const qs = new URLSearchParams();
        if (next.search) qs.set('search', next.search);
        if (next.status !== 'all') qs.set('status', next.status);
        if (next.sortBy !== 'newest') qs.set('sortBy', next.sortBy);
        if (next.page > 1) qs.set('page', String(next.page));

        const q = qs.toString();
        router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            navigate({ search: value, page: 1 });
        }, 350);
    };

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by name, email, or company..."
                    className="w-full rounded-xl border border-white/10 bg-surface-container/50 px-4 py-3 text-sm text-on-surface outline-none backdrop-blur-md transition-all placeholder:text-on-surface/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 md:w-80"
                />

                <select
                    value={sortBy}
                    onChange={(e) => navigate({ sortBy: e.target.value, page: 1 })}
                    className="w-full rounded-xl border border-white/10 bg-surface-container/50 px-4 py-3 text-sm text-on-surface outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50 md:w-64"
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest_score">Highest AI score</option>
                    <option value="lowest_score">Lowest AI score</option>
                </select>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
                {STATUS_TABS.map((tab) => {
                    const isActive = status === tab.value;

                    return (
                        <button
                            key={tab.value}
                            onClick={() => navigate({ status: tab.value, page: 1 })}
                            className={`rounded-xl px-5 py-2 text-sm font-bold transition-all ${
                                isActive
                                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                    : 'border border-white/5 bg-surface-container/50 text-on-surface/60 backdrop-blur-sm hover:bg-white/10 hover:text-on-surface'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {isUnavailable ? (
                <div className="glass-card rounded-3xl p-16 text-center">
                    <p className="text-lg font-bold text-on-surface">Backend is currently unavailable.</p>
                    <p className="mt-1 text-sm text-on-surface/50">Please try again in a moment.</p>
                </div>
            ) : leads.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center">
                    <p className="text-lg font-bold text-on-surface">
                        {search || status !== 'all' ? 'No leads match the current filters.' : 'No leads yet.'}
                    </p>
                    <p className="mt-1 text-sm text-on-surface/50">
                        {search || status !== 'all'
                            ? 'Try adjusting the search or status filter.'
                            : 'Create your first lead to get started.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="masonry-grid">
                        {leads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
                            <button
                                onClick={() => navigate({ page: page - 1 })}
                                disabled={page <= 1}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <span className="material-symbols-outlined text-base">chevron_left</span>
                                Previous
                            </button>

                            <span className="text-sm text-on-surface/60">
                                Page <span className="font-bold text-on-surface">{page}</span> of {totalPages}
                                <span className="ml-2 text-on-surface/40">· {total} leads</span>
                            </span>

                            <button
                                onClick={() => navigate({ page: page + 1 })}
                                disabled={page >= totalPages}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <span className="material-symbols-outlined text-base">chevron_right</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
