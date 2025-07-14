import { NextResponse } from 'next/server';
import { supabase, mockData, isUsingMockData } from '@/lib/supabase';

export async function GET() {
  try {
    if (isUsingMockData()) {
      // Utiliser les données mockées
      return NextResponse.json(mockData.products);
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(mockData.products);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API products:', error);
    return NextResponse.json(mockData.products);
  }
}