
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PerfumeCard, { Perfume } from "@/components/perfume-card";

// Mock Data (Fallback)
const MOCK_RECOMMENDATIONS: Perfume[] = [
    {
        id: "1",
        brand: "Le Labo",
        name: "Santal 33",
        matchScore: 98,
        notes: ["Sandalwood", "Cedar", "Leather", "Violet"],
        description: "An intoxicating blend of woody spices and leather that evokes the spirit of the American West.",
        tags: ["Woody", "Unisex", "Iconic"],
    },
];

function DiscoveryContent() {
    const searchParams = useSearchParams();
    const dna = searchParams.get("dna");
    const mode = searchParams.get("mode");

    const [recommendations, setRecommendations] = useState<Perfume[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                let body = {};

                if (mode === "analyze") {
                    const storedAnswers = localStorage.getItem("user_quiz_answers");
                    if (storedAnswers) {
                        body = { quiz_answers: JSON.parse(storedAnswers) };
                    }
                }

                const response = await fetch("/api/recommend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                if (!response.ok) throw new Error("Failed to fetch recommendations");

                const data = await response.json();
                setRecommendations(data);
            } catch (err) {
                console.error(err);
                setError("Using offline mode (Backend not reachable)");
                setRecommendations(MOCK_RECOMMENDATIONS);
            } finally {
                setLoading(false);
            }
        }

        fetchRecommendations();
    }, [mode]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-perfume-gold">Curating your scents...</div>;

    return (
        <main className="min-h-screen p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl lg:text-5xl font-serif text-white mb-4">
                        Your Daily Drop
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Based on your Scent DNA <span className="text-perfume-gold font-mono text-xs border border-perfume-gold/30 px-2 py-0.5 rounded ml-2">{dna || "ANALYZING..."}</span>
                    </p>
                    {error && <p className="text-red-400 mt-2">{error}</p>}
                </header>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Top Matches</h2>
                        <button className="text-sm text-perfume-gold hover:underline">Customize Feed</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendations.map((perfume) => (
                            <PerfumeCard key={perfume.id} perfume={perfume} />
                        ))}
                    </div>
                </section>

                <section className="mt-24">
                    <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-12 border border-gray-800 text-center">
                        <h2 className="text-3xl font-serif mb-4">Why these scents?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                            Your answers indicated a preference for <span className="text-white">woody and warm</span> notes with a hint of sweetness.
                            We avoided overly floral profiles as per your "Clean & Fresh" preference overlap.
                        </p>
                        <div className="flex justify-center gap-4">
                            <div className="bg-gray-800 px-4 py-2 rounded-lg">
                                <span className="block text-xs text-gray-500 uppercase">Top Note</span>
                                Sandlewood
                            </div>
                            <div className="bg-gray-800 px-4 py-2 rounded-lg">
                                <span className="block text-xs text-gray-500 uppercase">Vibe</span>
                                Cozy
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default function DiscoveryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-perfume-gold">Curating your scents...</div>}>
            <DiscoveryContent />
        </Suspense>
    );
}
