export const triggerLeadAnalysisWorkflow = async (lead: unknown) => {
    try {
        await fetch(process.env.N8N_WEBHOOK_URL as string, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lead)
        })
    } catch (error) {
        console.error('Failed to trigger n8n workflow:', error);
    }
}