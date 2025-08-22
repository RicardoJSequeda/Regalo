import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/server/supabase-admin'

export async function GET() {
  try {
    const supabase = getAdminClient()
    
    const { data: surprises, error } = await supabase
      .from('surprises')
      .select('*')
      .order('order', { ascending: true })
    
    if (error) {
      console.error('Error fetching surprises:', error)
      return NextResponse.json({ error: 'Error fetching surprises' }, { status: 500 })
    }
    
    return NextResponse.json(surprises)
  } catch (error) {
    console.error('Error in GET /api/surprises:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()
    
    const { data: surprise, error } = await supabase
      .from('surprises')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating surprise:', error)
      return NextResponse.json({ error: 'Error creating surprise' }, { status: 500 })
    }
    
    return NextResponse.json(surprise, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/surprises:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
