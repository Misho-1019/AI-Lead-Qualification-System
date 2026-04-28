'use client'

import { createLead } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";

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
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-3xl px-6 py-10">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        ← Back to dashboard
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Create New Lead
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Add a new inbound lead and trigger AI qualification automatically.
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            After submission, the lead will appear on the dashboard and AI analysis will be generated automatically.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="John Doe"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="john@example.com"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="Acme Inc."
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="Founder"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Industry
                                </label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="SaaS"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="https://company.com"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Company Size
                                </label>
                                <input
                                    type="text"
                                    name="company_size"
                                    value={formData.company_size}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="50-200"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Budget Range
                                </label>
                                <input
                                    type="text"
                                    name="budget_range"
                                    value={formData.budget_range}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="10k-20k"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Source
                                </label>
                                <input
                                    type="text"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                    placeholder="Website form"
                                    disabled={isSubmitting}
                                />
                            </div>

                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Pain Point
                            </label>
                            <textarea
                                name="pain_point"
                                value={formData.pain_point}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                placeholder="Describe the lead's main challenge..."
                                rows={4}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70"
                                placeholder="Any extra context about the lead..."
                                rows={4}
                                disabled={isSubmitting}
                            />
                        </div>

                        {error ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creating lead...' : 'Create Lead'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}