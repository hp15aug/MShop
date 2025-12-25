import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY_LITE!);

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `You are an expert AI art prompt engineer for T-shirt designs. 
        Rewrite the following user prompt to be more descriptive, artistic, and suitable for a high-quality T-shirt print. 
        Keep it under 30 words. Focus on visual style, composition, and mood. 
        Do not add conversational text, just return the enhanced prompt.
        
        User Prompt: ${prompt}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const enhancedPrompt = response.text();

        return NextResponse.json({ enhancedPrompt });

    } catch (error) {
        console.error('Enhancement Error:', error);
        return NextResponse.json({ error: 'Failed to enhance prompt' }, { status: 500 });
    }
}
