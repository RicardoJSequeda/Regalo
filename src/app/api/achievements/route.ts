import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/server/supabase-admin'

export async function GET() {
  try {
    const supabase = getAdminClient()
    
    const { data: achievements, error } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement', { ascending: true })
    
    if (error) {
      console.error('Error fetching achievements:', error)
      return NextResponse.json({ error: 'Error fetching achievements' }, { status: 500 })
    }
    
    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error in GET /api/achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()
    
    const { data: achievement, error } = await supabase
      .from('achievements')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating achievement:', error)
      return NextResponse.json({ error: 'Error creating achievement' }, { status: 500 })
    }
    
    return NextResponse.json(achievement, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/achievements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

