const RESEND_API_URL = 'https://api.resend.com/emails';

type LeadEmailTarget = {
    email: string;
};

type LeadEmailContent = {
    outreach_email_subject: string;
    outreach_email_body: string;
};

export const sendLeadEmail = async (
    lead: LeadEmailTarget,
    analysis: LeadEmailContent
) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error('RESEND_API_KEY is not configured');
    }

    const to = process.env.EMAIL_TEST_TO || lead.email;
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to,
            subject: analysis.outreach_email_subject,
            text: analysis.outreach_email_body,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`Resend failed with status ${response.status}: ${errorBody}`);
    }

    return response.json();
};
