import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY_LITE!);

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Using gemini-1.5-flash as a reliable default. 
        // If the user specifically needs a different model, this can be updated.
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `Generate a creative, catchy, and short (3-5 words) T-shirt product name based on the following design description. 
        Do not use quotes. Just return the name.
        
        Design Description: ${prompt}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const suggestedName = response.text().trim().replace(/^["']|["']$/g, ''); // Remove quotes if present

        return NextResponse.json({ suggestedName });

    } catch (error) {
        console.error('Name Suggestion Error:', error);
        return NextResponse.json({ error: 'Failed to suggest name' }, { status: 500 });
    }
}
