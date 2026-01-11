import { NextResponse } from 'next/server';
import { recommender } from '@/lib/recommender';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { answers } = body;

        if (!answers) {
            return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
        }

        // 1. Analyze User
        const { dna, keywords } = recommender.analyzeUser(answers);

        // 2. Get Recommendations
        const results = recommender.recommend(dna, keywords);

        return NextResponse.json({
            dna_vector: dna,
            analysis: { keywords },
            recommendations: results
        });
    } catch (error) {
        console.error('Recommendation Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
