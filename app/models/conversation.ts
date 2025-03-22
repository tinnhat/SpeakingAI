import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  create_date: { type: Date, default: Date.now },
  id_detail: { type: mongoose.Schema.Types.ObjectId, ref: 'DetailConversation' },
})

const detailConversationSchema = new mongoose.Schema({
  content: [
    {
      id: Number,
      text: String,
      isAI: Boolean,
    },
  ],
})

export const Conversation =
  mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema)
export const DetailConversation =
  mongoose.models.DetailConversation ||
  mongoose.model('DetailConversation', detailConversationSchema)
