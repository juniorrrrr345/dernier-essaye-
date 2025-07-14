import { NextResponse } from 'next/server';
import { supabase, mockData, isUsingMockData } from '@/lib/supabase';

export async function GET() {
  try {
    if (isUsingMockData()) {
      // Utiliser les données mockées
      return NextResponse.json(mockData.shopConfig);
    }

    // Utiliser Supabase si configuré
    const { data, error } = await supabase
      .from('shop_config')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(mockData.shopConfig);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API config:', error);
    return NextResponse.json(mockData.shopConfig);
  }
}