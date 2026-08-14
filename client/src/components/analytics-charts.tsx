'use client'

import { ReactNode } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { AnalyticsOverview } from '@/types/lead';

const PRIORITY_COLORS: Record<string, string> = {
    high: '#f43f5e',
    medium: '#f59e0b',
    low: '#10b981',
};

const STATUS_COLORS: Record<string, string> = {
    new: '#94a3b8',
    contacted: '#60a5fa',
    qualified: '#10b981',
    rejected: '#f43f5e',
};

const TOOLTIP_STYLE = {
    background: '#10121e',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    color: '#f8fafc',
};

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
    return (
        <div className="glass-card rounded-3xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface/60">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-on-surface/40">{subtitle}</p>}
            <div className="mt-4 h-64">{children}</div>
        </div>
    );
}

export default function AnalyticsCharts({ data }: { data: AnalyticsOverview }) {
    const totalPriority = data.priorityBreakdown.reduce((sum, d) => sum + d.count, 0);
    const totalStatus = data.statusBreakdown.reduce((sum, d) => sum + d.count, 0);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card title="AI Score Distribution" subtitle="Number of leads per score bucket">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.scoreDistribution} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Priority Breakdown" subtitle={`${totalPriority} analyzed leads`}>
                <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                        <Pie
                            data={data.priorityBreakdown}
                            dataKey="count"
                            nameKey="priority"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            stroke="none"
                        >
                            {data.priorityBreakdown.map((entry) => (
                                <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] ?? '#64748b'} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4">
                    {data.priorityBreakdown.map((entry) => (
                        <div key={entry.priority} className="flex items-center gap-2 text-sm capitalize text-on-surface/70">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PRIORITY_COLORS[entry.priority] ?? '#64748b' }} />
                            {entry.priority} · {entry.count}
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Status Breakdown" subtitle={`${totalStatus} leads`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.statusBreakdown} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {data.statusBreakdown.map((entry) => (
                                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#64748b'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Leads Over Time" subtitle="New leads per day">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.leadsOverTime} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Line type="monotone" dataKey="count" stroke="#818cf8" strokeWidth={2} dot={{ fill: '#818cf8', r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
