import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { prompt, color } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const svgPrompt = `Generate a minimalist SVG design for a t-shirt based on this description: "${prompt}". The t-shirt color is ${color}. 
    Return ONLY the raw SVG code. Do not include markdown backticks. 
    The SVG should be high quality, scalable, and suitable for printing.
    Ensure the background is transparent or matches the t-shirt color if necessary.`;

        const result = await model.generateContent(svgPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present
        let svgContent = text.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();

        // Extract SVG tag if there's extra text
        const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/i);
        if (svgMatch) {
            svgContent = svgMatch[0];
        }

        // Convert to base64
        const base64Image = Buffer.from(svgContent).toString('base64');
        const dataUrl = `data:image/svg+xml;base64,${base64Image}`;

        return NextResponse.json({ image: dataUrl });

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json({ error: 'Failed to generate design' }, { status: 500 });
    }
}
