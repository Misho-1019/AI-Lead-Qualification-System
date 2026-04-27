'use client'

import Link from "next/link";
import { useMemo, useState } from "react";

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

type LeadsDashboardProps = {
    leads: Lead[];
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

export default function LeadsDashboard({ leads }: LeadsDashboardProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')

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
        <>
            <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Search
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, or company"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Status
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                    >
                        <option value="all">All statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="highest_score">Highest AI score</option>
                        <option value="lowest_score">Lowest AI score</option>
                    </select>
                </div>
            </div>

            {filteredLeads.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-slate-700">No leads match the current filters.</p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2">
                    {filteredLeads.map((lead) => (
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
                                        {lead.analysis ? lead.analysis.score : 'Analyzing...'}
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
                                    {lead.analysis
                                        ? lead.analysis.summary
                                        : 'AI is analyzing this lead...'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}