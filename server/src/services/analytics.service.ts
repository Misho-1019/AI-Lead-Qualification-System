import prisma from "../utils/prisma";

export type AnalyticsOverview = {
    scoreDistribution: { range: string; count: number }[];
    priorityBreakdown: { priority: string; count: number }[];
    statusBreakdown: { status: string; count: number }[];
    leadsOverTime: { date: string; count: number }[];
};

const SCORE_BUCKETS = [
    '0-9', '10-19', '20-29', '30-39', '40-49',
    '50-59', '60-69', '70-79', '80-89', '90-100',
];

export const getLeadAnalytics = async (): Promise<AnalyticsOverview> => {
    const leads = await prisma.lead.findMany({
        select: {
            created_at: true,
            status: true,
            analysis: { select: { score: true, priority: true } },
        },
    });

    const scoreCounts = new Array(10).fill(0) as number[];
    const priorityMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};
    const dateMap: Record<string, number> = {};

    for (const lead of leads) {
        const score = lead.analysis?.score;

        if (typeof score === 'number') {
            scoreCounts[Math.min(9, Math.floor(score / 10))]++;
        }

        const priority = lead.analysis?.priority;
        if (priority) {
            priorityMap[priority] = (priorityMap[priority] ?? 0) + 1;
        }

        statusMap[lead.status] = (statusMap[lead.status] ?? 0) + 1;

        const date = lead.created_at.toISOString().slice(0, 10);
        dateMap[date] = (dateMap[date] ?? 0) + 1;
    }

    return {
        scoreDistribution: SCORE_BUCKETS.map((range, i) => ({ range, count: scoreCounts[i] })),
        priorityBreakdown: Object.entries(priorityMap).map(([priority, count]) => ({ priority, count })),
        statusBreakdown: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
        leadsOverTime: Object.entries(dateMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count })),
    };
};
