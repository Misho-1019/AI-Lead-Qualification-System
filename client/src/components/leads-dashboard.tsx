'use client'

import Link from "next/link";
import { useMemo, useState } from "react";
import { Lead } from "@/types/lead";

type LeadsDashboardProps = {
    leads: Lead[];
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

export default function LeadsDashboard({ leads }: LeadsDashboardProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const filteredLeads = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        const filtered = leads.filter(lead => {
            const matchesSearch =
                normalizedSearch === '' ||
                lead.full_name.toLowerCase().includes(normalizedSearch) ||
                lead.email.toLowerCase().includes(normalizedSearch) ||
                (lead.company ?? '').toLowerCase().includes(normalizedSearch);

            const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

            return matchesSearch && matchesStatus;
        })

        const sorted = [...filtered];

        switch (sortBy) {
            case 'highest_score':
                sorted.sort((a, b) => (b.analysis?.score ?? -1) - (a.analysis?.score ?? -1));
                break;
            case 'lowest_score':
                sorted.sort((a, b) => (a.analysis?.score ?? 999) - (b.analysis?.score ?? 999));
                break;
            case 'oldest':
                sorted.sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
                break;
            case 'newest':
            default:
                sorted.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                break;
        }

        return sorted;
    }, [leads, search, statusFilter, sortBy])

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, or company..."
                    className="w-full rounded-xl border border-white/10 bg-surface-container/50 px-4 py-3 text-sm text-on-surface outline-none backdrop-blur-md transition-all placeholder:text-on-surface/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 md:w-80"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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
                    const isActive = statusFilter === tab.value;

                    return (
                        <button
                            key={tab.value}
                            onClick={() => setStatusFilter(tab.value)}
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

            {filteredLeads.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center">
                    <p className="text-lg font-bold text-on-surface">No leads match the current filters.</p>
                    <p className="mt-1 text-sm text-on-surface/50">Try adjusting the search or status filter.</p>
                </div>
            ) : (
                <div className="masonry-grid">
                    {filteredLeads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </div>
            )}
        </div>
    );
}
