import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/server/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()
    
    const { data: progress, error } = await supabase
      .from('unlock_progress')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating unlock progress:', error)
      return NextResponse.json({ error: 'Error creating unlock progress' }, { status: 500 })
    }
    
    return NextResponse.json(progress, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/unlock-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient()
    const { searchParams } = new URL(request.url)
    const surpriseId = searchParams.get('surpriseId')
    
    let query = supabase
      .from('unlock_progress')
      .select('*')
      .order('attemptedAt', { ascending: false })
    
    if (surpriseId) {
      query = query.eq('surpriseId', surpriseId)
    }
    
    const { data: progress, error } = await query
    
    if (error) {
      console.error('Error fetching unlock progress:', error)
      return NextResponse.json({ error: 'Error fetching unlock progress' }, { status: 500 })
    }
    
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error in GET /api/unlock-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

