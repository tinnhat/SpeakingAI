import { connectDB } from '@/app/lib/mongodb'
import { Conversation, DetailConversation } from '@/app/models/conversation'
import { NextResponse } from 'next/server'

// Get all conversations (without details)
export async function GET() {
  try {
    await connectDB()
    const conversations = await Conversation.find({}, { id_detail: 0 }).sort({ create_date: -1 })

    return NextResponse.json({ conversations }, { status: 200 })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

// Create new conversation
export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()

    // Create detail conversation first
    const detailConversation = await DetailConversation.create({
      content: body.content,
    })

    // Create main conversation
    const conversation = await Conversation.create({
      name: body.name,
      id_detail: detailConversation._id,
      create_date: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        conversation: {
          ...conversation.toObject(),
          content: body.content,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}
