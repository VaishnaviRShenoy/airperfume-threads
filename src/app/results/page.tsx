"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Perfume } from "@/lib/recommender";

export default function ResultsPage() {
    const [recommendations, setRecommendations] = useState<Perfume[]>([]);
    const [userKeywords, setUserKeywords] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from session storage
        if (typeof window !== "undefined") {
            const storedRecs = sessionStorage.getItem("recommendations");
            const storedDna = sessionStorage.getItem("dna");

            // In a real app we might also store the analysis keywords

            if (storedRecs) {
                setRecommendations(JSON.parse(storedRecs));
            }
            setLoading(false);
        }
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen p-8 pt-24 pb-24 relative overflow-x-hidden">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                    Your Scent Signature
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Based on your unique sensory profile, we have curated these exceptional fragrances for you.
                </p>
            </div>

            {loading ? (
                <div className="text-center">Loading your matches...</div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {recommendations.map((perfume) => (
                        <motion.div
                            key={perfume.id}
                            variants={item}
                            className="group relative bg-card border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all duration-500 hover:shadow-glow"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 block">
                                    {perfume.brand}
                                </span>
                                {perfume.matchScore && (
                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                        {perfume.matchScore}% Match
                                    </div>
                                )}
                            </div>

                            <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                                {perfume.name}
                            </h3>

                            <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                                {perfume.description}
                            </p>

                            {/* Reasoning */}
                            {perfume.reasoning && (
                                <div className="mb-6 p-3 bg-white/5 rounded-lg text-xs italic text-gray-300">
                                    "{perfume.reasoning}"
                                </div>
                            )}

                            {/* Notes */}
                            <div className="space-y-3 mb-8">
                                <div className="flex flex-wrap gap-2">
                                    {perfume.notes.top.slice(0, 3).map(n => (
                                        <span key={n} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 rounded-md">
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href={perfume.link || `https://www.google.com/search?q=${perfume.brand}+${perfume.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-lg bg-white/5 hover:bg-primary hover:text-black font-bold uppercase text-xs tracking-widest transition-all duration-300 block text-center"
                            >
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent pointer-events-none flex justify-center pb-8">
                <Link href="/quiz" className="pointer-events-auto text-sm text-muted-foreground hover:text-white transition-colors underline decoration-primary/50 underline-offset-4">
                    Retake Quiz
                </Link>
            </div>
        </main>
    );
}
