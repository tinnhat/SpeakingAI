import { connectDB } from '@/app/lib/mongodb'
import { Conversation, DetailConversation } from '@/app/models/conversation'
import { NextResponse } from 'next/server'

// Get conversation by ID with details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const conversation = await Conversation.findById(params.id)
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    const details = await DetailConversation.findById(conversation.id_detail)
    
    return NextResponse.json({
      conversation: {
        ...conversation.toObject(),
        details
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}

// Update conversation details
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    
    const conversation = await Conversation.findById(params.id)
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    // Update conversation details
    await DetailConversation.findByIdAndUpdate(
      conversation.id_detail,
      { content: body.content }
    )
    
    // Update conversation name if provided
    if (body.name) {
      conversation.name = body.name
      await conversation.save()
    }
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}

// Delete conversation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const conversation = await Conversation.findById(params.id)
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    // Delete detail conversation first
    await DetailConversation.findByIdAndDelete(conversation.id_detail)
    
    // Delete main conversation
    await Conversation.findByIdAndDelete(params.id)
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
} 