import prisma from '../src/utils/prisma';

const leads = [
    {
        full_name: 'Sarah Mitchell',
        email: 'sarah@lumina.io',
        company: 'Lumina SaaS',
        role: 'CTO',
        industry: 'SaaS',
        company_size: '150-200',
        budget_range: '$50k - 75k',
        source: 'LinkedIn',
        pain_point: "Scaling their customer onboarding pipeline; current tooling can't keep up.",
        status: 'qualified',
        analysis: {
            score: 84,
            priority: 'high',
            summary: 'High-velocity intent detected. Matches the enterprise ICP profile with 94% accuracy. Primary friction point is scalability.',
            qualification_reason: 'Strong budget signal and executive sponsorship.',
            outreach_email_subject: "Scaling Lumina's onboarding",
            outreach_email_body: 'Hi Sarah,\n\nYour team is scaling fast and your current onboarding tooling is the bottleneck. Let us show you how we automate qualification at enterprise volume.\n\nBest,\nThe Apex AI team',
            recommended_next_step: 'Book a technical demo within 48 hours.',
        },
    },
    {
        full_name: 'Marcus Lee',
        email: 'marcus.l@healthpulse.ai',
        company: 'HealthPulse',
        role: 'VP Ops',
        industry: 'Healthtech',
        company_size: '500+',
        budget_range: '$100k+',
        source: 'Referral',
        pain_point: 'HIPAA-compliant AI processing; current infrastructure is failing compliance checks.',
        status: 'new',
        analysis: {
            score: 78,
            priority: 'high',
            summary: 'High-value prospect with urgent need for HIPAA-compliant AI processing. Compliance is the primary driver.',
            qualification_reason: 'Urgent compliance deadline creates a strong buying window.',
            outreach_email_subject: 'HIPAA-compliant AI processing',
            outreach_email_body: 'Hi Marcus,\n\nWe noticed your compliance deadline is approaching. Our platform is HIPAA-ready out of the box.\n\nBest,\nThe Apex AI team',
            recommended_next_step: 'Immediate executive outreach.',
        },
    },
    {
        full_name: 'James Carter',
        email: 'j.carter@finflow.com',
        company: 'FinFlow Fintech',
        role: 'VP Product',
        industry: 'Fintech',
        company_size: '50-100',
        budget_range: '$25k',
        source: 'Website form',
        pain_point: 'Security and compliance modules for AI processing.',
        status: 'new',
        analysis: {
            score: 62,
            priority: 'medium',
            summary: 'Initial research shows interest in compliance modules. Requires technical vetting on data security protocols.',
            qualification_reason: 'Interested but needs technical validation.',
            outreach_email_subject: 'Compliance module deep-dive',
            outreach_email_body: 'Hi James,\n\nLet us walk you through our compliance and security modules.\n\nBest,\nThe Apex AI team',
            recommended_next_step: 'Schedule a security review call.',
        },
    },
    {
        full_name: 'Priya Sharma',
        email: 'p.sharma@cartify.com',
        company: 'Cartify',
        role: 'Lead Engineer',
        industry: 'E-commerce',
        company_size: '20-50',
        budget_range: '$10k',
        source: 'Referral',
        pain_point: 'API integration complexity; blocked on competitive pricing.',
        status: 'contacted',
        analysis: {
            score: 45,
            priority: 'low',
            summary: 'Price sensitivity detected. Currently blocked on integration complexity. Recommended nurture track.',
            qualification_reason: 'Limited budget and strong competitive pressure.',
            outreach_email_subject: 'Integration options',
            outreach_email_body: 'Hi Priya,\n\nWe can explore flexible integration and pricing options that fit your roadmap.\n\nBest,\nThe Apex AI team',
            recommended_next_step: 'Add to nurture sequence.',
        },
    },
    {
        full_name: 'Amelia Rodriguez',
        email: 'amelia.rodriguez@brightscale.io',
        company: 'Brightscale',
        role: 'VP of Sales',
        industry: 'SaaS',
        company_size: '200-500',
        budget_range: '$30k - 60k',
        source: 'LinkedIn',
        pain_point: 'SDR team manually qualifies 400+ inbound leads a month; high-intent ones go cold before follow-up.',
        status: 'new',
        analysis: {
            score: 88,
            priority: 'high',
            summary: 'High-volume inbound motion with clear qualification pain. Budget and authority are present. Strong fit.',
            qualification_reason: 'Executive sponsor plus a well-articulated, high-frequency pain point.',
            outreach_email_subject: 'Automating qualification at Brightscale',
            outreach_email_body: 'Hi Amelia,\n\nWith 400+ inbound leads a month, speed-to-follow-up is your biggest lever. We automate scoring and prioritization so your team focuses only on high-intent accounts.\n\nBest,\nThe Apex AI team',
            recommended_next_step: 'Schedule a discovery call this week.',
        },
    },
];

async function main() {
    const count = await prisma.lead.count();

    if (count > 0) {
        console.log(`Skipping seed: ${count} leads already exist.`);
        return;
    }

    for (const lead of leads) {
        const { analysis, ...data } = lead;
        const created = await prisma.lead.create({ data });
        await prisma.leadAnalysis.create({ data: { ...analysis, lead_id: created.id } });
        console.log(`Seeded: ${created.full_name}`);
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
