import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/server/supabase-admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient()
    const body = await request.json()
    
    const { data: surprise, error } = await supabase
      .from('surprises')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating surprise:', error)
      return NextResponse.json({ error: 'Error updating surprise' }, { status: 500 })
    }
    
    return NextResponse.json(surprise)
  } catch (error) {
    console.error('Error in PATCH /api/surprises/[id]:', error)
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
      .from('surprises')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      console.error('Error deleting surprise:', error)
      return NextResponse.json({ error: 'Error deleting surprise' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Surprise deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/surprises/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
