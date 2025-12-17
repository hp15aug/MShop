import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { base64Image, prompt, color, shipmentDetails } = await request.json();

        if (!base64Image || !prompt || !color || !shipmentDetails) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Upload image to Storage
        // Convert base64 to buffer
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        const fileName = `${user.id}/${Date.now()}-design.svg`; // Assuming SVG from generate route

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('tshirt-designs')
            .upload(fileName, buffer, {
                contentType: 'image/svg+xml',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error('Failed to upload image');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('tshirt-designs')
            .getPublicUrl(fileName);

        // 2. Insert record into Database
        const { data: insertData, error: insertError } = await supabase
            .from('designs')
            .insert({
                user_id: user.id,
                image_url: publicUrl,
                prompt_text: prompt,
                base_color: color,
                user_email: user.email,
                shipment_name: shipmentDetails.name,
                shipment_address: shipmentDetails.address,
                shipment_phone: shipmentDetails.phone
            })
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            throw new Error('Failed to save design record');
        }

        return NextResponse.json({ success: true, design: insertData });

    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: (error as Error).message || 'Failed to save design' }, { status: 500 });
    }
}
