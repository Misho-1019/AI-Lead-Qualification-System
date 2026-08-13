const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert B2B sales lead qualifier. Analyze the given inbound sales lead and return a JSON object with EXACTLY these keys:
- "score": integer between 0 and 100 (overall lead quality)
- "priority": one of "high", "medium", "low"
- "summary": concise 2-3 sentence summary of the lead and why it matters
- "qualification_reason": short reason explaining the qualification
- "outreach_email_subject": a compelling, personalized email subject line
- "outreach_email_body": a friendly multi-paragraph outreach email (plain text, use \\n for line breaks)
- "recommended_next_step": the single best next action for sales

Base the score and priority on: company fit, budget signal, urgency, role, industry, and the stated pain point. Be realistic and specific. Output ONLY valid JSON.`;

export type LeadAnalysisResult = {
    score: number;
    priority: string;
    summary: string;
    qualification_reason: string;
    outreach_email_subject: string;
    outreach_email_body: string;
    recommended_next_step: string;
};

type LeadForAnalysis = {
    full_name: string;
    email: string;
    company?: string | null;
    role?: string | null;
    website?: string | null;
    industry?: string | null;
    company_size?: string | null;
    budget_range?: string | null;
    source?: string | null;
    pain_point?: string | null;
    notes?: string | null;
};

export const analyzeLeadWithAI = async (lead: LeadForAnalysis): Promise<LeadAnalysisResult> => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not configured');
    }

    const userContent = JSON.stringify({
        full_name: lead.full_name,
        email: lead.email,
        company: lead.company ?? null,
        role: lead.role ?? null,
        website: lead.website ?? null,
        industry: lead.industry ?? null,
        company_size: lead.company_size ?? null,
        budget_range: lead.budget_range ?? null,
        source: lead.source ?? null,
        pain_point: lead.pain_point ?? null,
        notes: lead.notes ?? null,
    }, null, 2);

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Analyze this lead:\n${userContent}` },
            ],
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`OpenAI failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content as string | undefined;

    if (!content) {
        throw new Error('OpenAI returned no content');
    }

    const parsed = JSON.parse(content) as Partial<LeadAnalysisResult>;

    if (
        typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 100 ||
        typeof parsed.priority !== 'string' || !parsed.priority.trim() ||
        typeof parsed.summary !== 'string' || !parsed.summary.trim() ||
        typeof parsed.qualification_reason !== 'string' || !parsed.qualification_reason.trim() ||
        typeof parsed.outreach_email_subject !== 'string' || !parsed.outreach_email_subject.trim() ||
        typeof parsed.outreach_email_body !== 'string' || !parsed.outreach_email_body.trim() ||
        typeof parsed.recommended_next_step !== 'string' || !parsed.recommended_next_step.trim()
    ) {
        throw new Error('OpenAI returned an invalid analysis payload');
    }

    return parsed as LeadAnalysisResult;
};
