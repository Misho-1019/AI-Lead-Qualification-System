import { Lead } from "@/types/lead";

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
    return result.data;
}

export async function getLead(id: string): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
        cache: 'no-store'
    });

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