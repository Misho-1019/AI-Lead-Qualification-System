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