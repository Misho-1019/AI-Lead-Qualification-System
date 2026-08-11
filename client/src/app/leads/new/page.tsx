'use client'

import { createLead } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";

const INPUT_CLASS =
    'w-full rounded-xl border border-white/10 bg-surface-container/50 py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface/30 outline-none backdrop-blur-sm transition focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70';

const LABEL_CLASS = 'mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface/60';

const ICON_CLASS = 'material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface/40';

export default function NewLeadPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        company: '',
        role: '',
        website: '',
        industry: '',
        company_size: '',
        budget_range: '',
        source: '',
        pain_point: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await createLead(formData);

            toast.success('Lead created successfully');
            router.push('/');
            router.refresh();
        } catch {
            setError('Failed to create the lead. Please try again.');
            toast.error('Failed to create lead');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen font-body">
            <div className="pointer-events-none fixed top-0 left-0 h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
            <div className="pointer-events-none fixed bottom-0 right-0 h-[50%] w-[50%] rounded-full bg-tertiary/5 blur-[150px]" />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10">
                <nav className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface/60 transition-colors hover:text-primary"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to dashboard
                    </Link>
                </nav>

                <div className="flex flex-1 justify-center pb-10">
                    <div className="glass-card w-full max-w-3xl rounded-3xl p-8 md:p-12">
                        <header className="relative z-10 mb-10">
                            <h1 className="gradient-text font-headline text-3xl font-black tracking-tight md:text-4xl">
                                Create New Lead
                            </h1>
                            <p className="mt-2 text-base text-on-surface/60">
                                Add a new inbound lead and trigger AI qualification automatically.
                            </p>
                            <div className="mt-4 inline-flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-on-surface/60">
                                <span className="material-symbols-outlined mt-0.5 shrink-0 text-lg text-tertiary">
                                    info
                                </span>
                                <span>
                                    After submission, the lead will appear on the dashboard and AI analysis will be generated automatically.
                                </span>
                            </div>
                        </header>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className={LABEL_CLASS} htmlFor="full_name">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>person</span>
                                        <input
                                            type="text"
                                            id="full_name"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="John Doe"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="email">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>mail</span>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="john@example.com"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="company">
                                        Company
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>apartment</span>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="Acme Inc."
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="role">
                                        Role / Title
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>badge</span>
                                        <input
                                            type="text"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="Founder"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="industry">
                                        Industry
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>factory</span>
                                        <input
                                            type="text"
                                            id="industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="SaaS"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="website">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>language</span>
                                        <input
                                            type="url"
                                            id="website"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="https://company.com"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="company_size">
                                        Company Size
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>groups</span>
                                        <input
                                            type="text"
                                            id="company_size"
                                            name="company_size"
                                            value={formData.company_size}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="50-200"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="budget_range">
                                        Budget Range
                                    </label>
                                    <div className="relative">
                                        <span className={ICON_CLASS}>payments</span>
                                        <input
                                            type="text"
                                            id="budget_range"
                                            name="budget_range"
                                            value={formData.budget_range}
                                            onChange={handleChange}
                                            className={INPUT_CLASS}
                                            placeholder="10k-20k"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={LABEL_CLASS} htmlFor="source">
                                    Lead Source
                                </label>
                                <div className="relative">
                                    <span className={ICON_CLASS}>device_hub</span>
                                    <input
                                        type="text"
                                        id="source"
                                        name="source"
                                        value={formData.source}
                                        onChange={handleChange}
                                        className={INPUT_CLASS}
                                        placeholder="Website form, LinkedIn, Referral..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="space-y-6">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className={LABEL_CLASS} htmlFor="pain_point">
                                            Pain Point / Needs
                                        </label>
                                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                                            AI will analyze this
                                        </span>
                                    </div>
                                    <textarea
                                        id="pain_point"
                                        name="pain_point"
                                        value={formData.pain_point}
                                        onChange={handleChange}
                                        className={`${INPUT_CLASS} resize-y pl-4`}
                                        placeholder="Describe the core problem this lead is trying to solve..."
                                        rows={4}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className={LABEL_CLASS} htmlFor="notes">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className={`${INPUT_CLASS} resize-y pl-4`}
                                        placeholder="Any context, background info, or next steps..."
                                        rows={3}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {error ? (
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                                    {error}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="gradient-primary relative flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-xl">add_circle</span>
                                {isSubmitting ? 'Creating lead...' : 'Create Lead'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
