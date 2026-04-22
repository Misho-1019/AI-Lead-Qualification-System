export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        AI Lead Qualification Dashboard
                    </h1>
                    <p className="mt-2 text-slate-600">
                        View inbound leads, qualification scores, and AI-generated outreach.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-slate-700">
                        Frontend setup is ready. Next step: fetch and display leads from the backend.
                    </p>
                </div>
            </div>
        </main>
    );
}