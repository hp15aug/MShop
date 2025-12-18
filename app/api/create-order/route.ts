import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { designId, size, shipmentDetails } = await request.json();

        if (!designId || !size || !shipmentDetails) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                design_id: designId,
                size: size,
                shipment_name: shipmentDetails.name,
                shipment_address: shipmentDetails.address,
                shipment_phone: shipmentDetails.phone,
                status: 'placed'
            })
            .select()
            .single();

        if (error) {
            console.error('Order creation error:', error);
            throw new Error('Failed to create order');
        }

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error('Order API Error:', error);
        return NextResponse.json({ error: (error as Error).message || 'Failed to process order' }, { status: 500 });
    }
}
