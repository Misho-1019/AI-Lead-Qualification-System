import crypto from 'crypto';

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

type ServiceAccountJson = {
    client_email: string;
    private_key: string;
};

let cachedToken: { access_token: string; expires_at: number } | null = null;

const parseServiceAccount = (): ServiceAccountJson | null => {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!raw) return null;

    try {
        return JSON.parse(raw) as ServiceAccountJson;
    } catch {
        console.error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON');
        return null;
    }
};

const getSpreadsheetId = (): string | null => process.env.GOOGLE_SHEETS_SPREADSHEET_ID || null;

const getRange = (): string => process.env.GOOGLE_SHEETS_RANGE || 'Sheet1!A1';

export const isSheetsConfigured = (): boolean => {
    return Boolean(getSpreadsheetId() && parseServiceAccount());
};

const base64UrlEncode = (input: string): string =>
    Buffer.from(input)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

const createJwt = (sa: ServiceAccountJson): string => {
    const now = Math.floor(Date.now() / 1000);

    const header = { alg: 'RS256', typ: 'JWT' };
    const claims = {
        iss: sa.client_email,
        scope: SHEETS_SCOPE,
        aud: TOKEN_URL,
        iat: now,
        exp: now + 3600,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaims = base64UrlEncode(JSON.stringify(claims));
    const signingInput = `${encodedHeader}.${encodedClaims}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signingInput);
    const signature = signer.sign(sa.private_key, 'base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return `${signingInput}.${signature}`;
};

const getAccessToken = async (): Promise<string> => {
    if (cachedToken && cachedToken.expires_at > Date.now() + 60000) {
        return cachedToken.access_token;
    }

    const sa = parseServiceAccount();

    if (!sa) {
        throw new Error('Google service account is not configured');
    }

    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: createJwt(sa),
        }),
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Google token failed with status ${response.status}: ${body}`);
    }

    const data = await response.json();

    if (!data.access_token) {
        throw new Error('Google returned no access token');
    }

    cachedToken = {
        access_token: data.access_token,
        expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
    };

    return data.access_token;
};

type SheetLead = {
    created_at?: Date | string | null;
    full_name: string;
    email: string;
    company?: string | null;
    role?: string | null;
    industry?: string | null;
    company_size?: string | null;
    budget_range?: string | null;
    source?: string | null;
    pain_point?: string | null;
    status?: string;
    analysis?: {
        score?: number | null;
        priority?: string | null;
        summary?: string | null;
        recommended_next_step?: string | null;
        outreach_email_subject?: string | null;
        outreach_email_body?: string | null;
    } | null;
};

const HEADERS = [
    'Created At', 'Full Name', 'Email', 'Company', 'Role', 'Industry', 'Company Size',
    'Budget Range', 'Source', 'Pain Point', 'Status', 'Score', 'Priority', 'Summary',
    'Recommended Next Step', 'Outreach Email Subject', 'Outreach Email Body',
];

const buildRow = (lead: SheetLead): string[] => [
    lead.created_at instanceof Date ? lead.created_at.toISOString() : String(lead.created_at ?? ''),
    lead.full_name,
    lead.email,
    lead.company ?? '',
    lead.role ?? '',
    lead.industry ?? '',
    lead.company_size ?? '',
    lead.budget_range ?? '',
    lead.source ?? '',
    lead.pain_point ?? '',
    lead.status ?? '',
    String(lead.analysis?.score ?? ''),
    lead.analysis?.priority ?? '',
    lead.analysis?.summary ?? '',
    lead.analysis?.recommended_next_step ?? '',
    lead.analysis?.outreach_email_subject ?? '',
    lead.analysis?.outreach_email_body ?? '',
];

export const appendLeadToSheet = async (lead: SheetLead): Promise<void> => {
    if (!isSheetsConfigured()) return;

    const token = await getAccessToken();
    const spreadsheetId = getSpreadsheetId() as string;
    const range = getRange();

    const response = await fetch(
        `${SHEETS_API}/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [buildRow(lead)] }),
        }
    );

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Sheets append failed with status ${response.status}: ${body}`);
    }
};

export const exportAllLeadsToSheet = async (leads: SheetLead[]): Promise<void> => {
    if (!isSheetsConfigured()) return;

    const token = await getAccessToken();
    const spreadsheetId = getSpreadsheetId() as string;
    const range = getRange();
    const baseUrl = `${SHEETS_API}/${spreadsheetId}/values/${range}`;

    const clearResponse = await fetch(`${baseUrl}:clear`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!clearResponse.ok) {
        const body = await clearResponse.text().catch(() => '');
        throw new Error(`Sheets clear failed with status ${clearResponse.status}: ${body}`);
    }

    const response = await fetch(`${baseUrl}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [HEADERS, ...leads.map(buildRow)] }),
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Sheets write failed with status ${response.status}: ${body}`);
    }
};
