"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type Question = {
    id: number;
    text: string;
    type: "single" | "multi";
    options: { label: string; value: string; emoji?: string }[];
};

const questions: Question[] = [
    {
        id: 1,
        text: "What vibe are you looking for?",
        type: "multi",
        options: [
            { label: "Clean & Fresh", value: "clean", emoji: "🛁" },
            { label: "Dark & Mysterious", value: "dark", emoji: "🌑" },
            { label: "Warm & Cozy", value: "warm", emoji: "🧣" },
            { label: "Floral & Romantic", value: "floral", emoji: "🌹" },
        ],
    },
    {
        id: 2,
        text: "Where will you wear this perfume?",
        type: "single",
        options: [
            { label: "Daily / Office", value: "office", emoji: "💼" },
            { label: "Date Night", value: "date", emoji: "🍷" },
            { label: "Vacation", value: "vacation", emoji: "🌴" },
            { label: "Gym / Active", value: "gym", emoji: "💪" },
        ],
    },
    {
        id: 3,
        text: "Pick a scent memory:",
        type: "single",
        options: [
            { label: "Walking in a pine forest after rain", value: "woody_rain", emoji: "🌲" },
            { label: "Baking vanilla cookies", value: "gourmand_cookies", emoji: "🍪" },
            { label: "A bouquet of fresh roses", value: "floral_rose", emoji: "💐" },
            { label: "Sipping a margarita on the beach", value: "citrus_beach", emoji: "🍹" },
        ],
    },
];

export default function QuizFlow() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

    const handleOptionSelect = (qId: number, val: string, type: "single" | "multi") => {
        if (type === "single") {
            setAnswers((prev) => ({ ...prev, [qId]: val }));
            // Auto advance for single choice
            setTimeout(() => handleNext(qId, val), 300);
        } else {
            setAnswers((prev) => {
                const current = (prev[qId] as string[]) || [];
                if (current.includes(val)) {
                    return { ...prev, [qId]: current.filter((v) => v !== val) };
                } else {
                    return { ...prev, [qId]: [...current, val] };
                }
            });
        }
    };

    const handleNext = (qId?: number, val?: string) => {
        // Check if we have an answer if we didn't just provide one
        if (!val && !answers[questions[step].id] && (!Array.isArray(answers[questions[step].id]) || (answers[questions[step].id] as string[]).length === 0)) {
            return;
        }

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Finish
            const finalAnswers = { ...answers, [currentQ.id]: val || answers[currentQ.id] };
            // Save to localStorage for persistence
            localStorage.setItem("user_quiz_answers", JSON.stringify(finalAnswers));
            router.push("/discovery?mode=analyze");
        }
    };

    const currentQ = questions[step];

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-perfume-gold to-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="bg-perfume-card rounded-2xl p-8 border border-gray-800"
                >
                    <h2 className="text-3xl font-serif mb-8">{currentQ.text}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQ.options.map((opt) => {
                            const isSelected =
                                currentQ.type === "single"
                                    ? answers[currentQ.id] === opt.value
                                    : (answers[currentQ.id] as string[])?.includes(opt.value);

                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => handleOptionSelect(currentQ.id, opt.value, currentQ.type)}
                                    className={`p-6 rounded-xl border text-left transition-all hover:scale-[1.02] ${isSelected
                                        ? "border-perfume-gold bg-perfume-gold/10 text-perfume-gold"
                                        : "border-gray-700 hover:border-gray-500"
                                        }`}
                                >
                                    <span className="text-2xl mr-3">{opt.emoji}</span>
                                    <span className="font-medium text-lg">{opt.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {currentQ.type === "multi" && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => handleNext()}
                                className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
