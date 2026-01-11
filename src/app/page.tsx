"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 relative overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10" />

            <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-primary tracking-[0.3em] text-sm uppercase font-semibold mb-4 block">
                        AI-Powered Fragrance Finder
                    </span>
                    <h1 className="text-7xl md:text-9xl font-serif font-bold text-white mb-6 tracking-tight">
                        Scentify<span className="text-primary">.</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
                >
                    Stop blind buying. Let our AI analyze your unique sensory DNA to find the perfect signature scent.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Link
                        href="/quiz"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-gray-100 hover:scale-105"
                    >
                        <span>Discover Your Scent</span>
                        <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>

                        {/* Glow Effect */}
                        <div className="absolute -inset-3 rounded-full bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                </motion.div>

            </div>

            {/* Footer / Trust Indicators */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 flex gap-8 text-sm text-muted-foreground uppercase tracking-widest"
            >
                <span>Curated Library</span>
                <span>•</span>
                <span>AI Matching</span>
                <span>•</span>
                <span>Premium Brands</span>
            </motion.div>
        </main>
    );
}
