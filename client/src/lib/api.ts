import { AnalyticsOverview, Lead, LeadStats } from "@/types/lead";

const getApiBaseUrl = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiBaseUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
    }

    return apiBaseUrl;
};

const API_BASE_URL = getApiBaseUrl();

export async function getLeads(): Promise<Lead[]> {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch leads');
    }

    const result = await response.json();
    return result.data.leads;
}

export async function getLeadStats(): Promise<LeadStats> {
    const response = await fetch(`${API_BASE_URL}/api/leads/stats`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch lead stats');
    }

    const result = await response.json();
    return result.data;
}

export async function getAnalytics(): Promise<AnalyticsOverview> {
    const response = await fetch(`${API_BASE_URL}/api/analytics`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch analytics');
    }

    const result = await response.json();
    return result.data;
}

export const createLead = async (leadData: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
    });

    if (!response.ok) {
        throw new Error('Failed to create lead');
    }

    return response.json();
};

export async function getLead(id: string): Promise<Lead | null> {
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
        cache: 'no-store'
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Failed to fetch lead');
    }

    const result = await response.json();
    return result.data;
}

export const reanalyzeLead = async (leadId: string) => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}/reanalyze`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to trigger reanalysis');
    }

    return response.json();
};

export const updateLeadStatus = async (leadId: string, status: string) => {
    const API_BASE_URL = getApiBaseUrl();

    const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error('Failed to update lead status');
    }

    return response.json();
};

export const sendLeadEmail = async (leadId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}/send-email`, {
        method: 'POST',
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message ?? 'Failed to send email');
    }

    return response.json();
};

export const exportLeadsToSheets = async () => {
    const response = await fetch(`${API_BASE_URL}/api/leads/export-to-sheets`, {
        method: 'POST',
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message ?? 'Failed to export leads to Google Sheets');
    }

    return response.json();
};