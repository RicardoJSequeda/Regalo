import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/server/supabase-admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()
    
    const { data: achievement, error } = await supabase
      .from('achievements')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating achievement:', error)
      return NextResponse.json({ error: 'Error updating achievement' }, { status: 500 })
    }
    
    return NextResponse.json(achievement)
  } catch (error) {
    console.error('Error in PATCH /api/achievements/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient()
    
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting achievement:', error)
      return NextResponse.json({ error: 'Error deleting achievement' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Achievement deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/achievements/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

