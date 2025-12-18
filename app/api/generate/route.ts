import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // 1. Authentication Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Inputs
        const { prompt, color } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('API Key is missing');
        }

        // 3. Construct the Imagen 4 Prompt
        // We ask for a product photo directly.
        const fullPrompt = `
            Professional high-end product photography of a ${color || 'white'} t-shirt laid flat on a clean, neutral background.
            The t-shirt occupies most of the frame with minimal empty space around the edges.

            A large, detailed, visually striking graphic design is printed on the chest area.
            The design should be scaled slightly larger than standard prints, covering a prominent portion of the upper torso,
            similar to modern premium graphic t-shirts.

            Design description:
            ${prompt}

            Style and quality requirements:
            - The tshirt should be ironed means no creases in the tshirt
            - High-resolution, vibrant colors
            - Crisp edges and sharp details
            - Professional DTG print appearance
            - Design blends naturally with the fabric texture
            - No text unless explicitly mentioned
            - No logos, watermarks, or mockups
            - Realistic fabric folds, subtle shadows
            - Photorealistic lighting, studio setup
            `;
        // 4. Call the Imagen 4 API Directly (Bypassing SDK issues)
        // We use the model specifically found in your list: 'imagen-4.0-generate-001'
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    instances: [
                        {
                            prompt: fullPrompt,
                        }
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "1:1" // Square image for product shot
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Imagen API Error:', errorText);
            throw new Error(`Google API refused request: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // 5. Extract Image
        // Imagen response structure: { predictions: [ { bytesBase64Encoded: "..." } ] }
        const prediction = data.predictions?.[0];

        if (!prediction || !prediction.bytesBase64Encoded) {
            console.error('Unexpected API Response:', data);
            throw new Error('No image data found in response');
        }

        const base64Image = prediction.bytesBase64Encoded;
        const dataUrl = `data:image/png;base64,${base64Image}`;

        return NextResponse.json({ image: dataUrl });

    } catch (error: any) {
        console.error('Generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate t-shirt image' },
            { status: 500 }
        );
    }
}