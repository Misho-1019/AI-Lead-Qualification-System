export const triggerLeadAnalysisWorkflow = async (lead: unknown) => {
    try {
        const response = await fetch(process.env.N8N_WEBHOOK_URL as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lead)
        })

        if (!response.ok) {
            throw new Error(`n8n webhook failed with status ${response.status}`);
        }
    } catch (error) {
        console.error('Failed to trigger n8n workflow:', error);
    }
}