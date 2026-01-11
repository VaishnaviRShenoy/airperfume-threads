"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Question = {
    id: number;
    text: string;
    options: { label: string; value: string; icon?: string }[];
    multi?: boolean;
};

const questions: Question[] = [
    {
        id: 1,
        text: "What vibe are you looking for today?",
        options: [
            { label: "Fresh & Clean", value: "clean", icon: "🧼" },
            { label: "Dark & Mysterious", value: "dark", icon: "🌑" },
            { label: "Warm & Cozy", value: "warm", icon: "🧣" },
            { label: "Romantic Floral", value: "floral", icon: "🌹" },
        ],
    },
    {
        id: 2,
        text: "Pick a memory that resonates with you.",
        options: [
            { label: "Walk in a rainy forest", value: "woody_rain", icon: "🌲" },
            { label: "Baking vanilla cookies", value: "gourmand_cookies", icon: "🍪" },
            { label: "Bouquet of fresh roses", value: "floral_rose", icon: "💐" },
            { label: "Salty ocean breeze", value: "citrus_beach", icon: "🌊" },
        ],
    },
];

export default function QuizPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
    const [loading, setLoading] = useState(false);

    const handleOptionSelect = (value: string) => {
        setAnswers((prev: Record<number, string | string[]>) => ({ ...prev, [questions[currentStep].id]: value }));

        // Auto-advance
        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep((prev: number) => prev + 1), 300);
        } else {
            submitQuiz({ ...answers, [questions[currentStep].id]: value });
        }
    };

    const submitQuiz = async (finalAnswers: Record<number, string | string[]>) => {
        setLoading(true);
        try {
            const res = await fetch("/api/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: finalAnswers }),
            });

            const data = await res.json();
            // Store results in local storage or state manager here if needed
            // For now, passing via query param is simple but size-limited.
            // Better: Store in sessionStorage
            if (typeof window !== "undefined") {
                sessionStorage.setItem("recommendations", JSON.stringify(data.recommendations));
                sessionStorage.setItem("dna", JSON.stringify(data.dna_vector));
            }

            router.push("/results");
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const currentQ = questions[currentStep];

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
            {/* Elements */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />

            <Link href="/" className="absolute top-8 left-8 text-muted-foreground hover:text-primary transition-colors">
                ← Back
            </Link>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <h2 className="text-2xl font-serif text-white">Analyzing Scent DNA...</h2>
                    </motion.div>
                ) : (
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-2xl w-full"
                    >
                        <div className="mb-8 text-center">
                            <span className="text-primary text-sm tracking-widest uppercase">
                                Question {currentStep + 1} / {questions.length}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-2">
                                {currentQ.text}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQ.options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleOptionSelect(option.value)}
                                    className="group relative p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 text-left flex items-start space-x-4"
                                >
                                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300 block">
                                        {option.icon}
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                                            {option.label}
                                        </h3>
                                    </div>

                                    {/* Selection Glow */}
                                    {answers[currentQ.id] === option.value && (
                                        <div className="absolute inset-0 rounded-xl ring-2 ring-primary bg-primary/10" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
