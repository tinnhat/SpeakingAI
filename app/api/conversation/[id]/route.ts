import { connectDB } from '@/app/lib/mongodb'
import { Conversation, DetailConversation } from '@/app/models/conversation'
import { NextResponse } from 'next/server'

// Get specific conversation with details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  
  try {
    await connectDB()
    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const details = await DetailConversation.findById(conversation.id_detail)
    return NextResponse.json({
      conversation: {
        ...conversation.toObject(),
        details
      }
    })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}

// Update conversation
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  
  try {
    await connectDB()
    const body = await request.json()
    const { content } = body

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    await DetailConversation.findByIdAndUpdate(conversation.id_detail, { content })

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 })
  }
}

// Delete conversation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  
  try {
    await connectDB()
    const conversation = await Conversation.findById(id)
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Delete detail conversation first
    await DetailConversation.findByIdAndDelete(conversation.id_detail)
    
    // Delete main conversation
    await Conversation.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
  }
} 