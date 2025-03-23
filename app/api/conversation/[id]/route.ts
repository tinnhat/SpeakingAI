import { connectDB } from '@/app/lib/mongodb';
import { Conversation, DetailConversation } from '@/app/models/conversation';
import { NextResponse } from 'next/server';

// Định nghĩa kiểu cho params bất đồng bộ
interface Params {
  id: string;
}

export async function GET(
  request: Request,
  context: { params: Promise<Params> } // params là Promise
) {
  const { id } = await context.params; // Dùng await đúng cách

  try {
    await connectDB();
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const details = await DetailConversation.findById(conversation.id_detail);
    return NextResponse.json({
      conversation: {
        ...conversation.toObject(),
        details,
      },
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

// Update conversation
export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    const body = await request.json();
    const { content } = body;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    await DetailConversation.findByIdAndUpdate(conversation.id_detail, { content });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}

// Delete conversation
export async function DELETE(
  request: Request,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  try {
    await connectDB();
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    await DetailConversation.findByIdAndDelete(conversation.id_detail);
    await Conversation.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}