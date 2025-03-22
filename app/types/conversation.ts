
export interface Message {
  id: number 
  text: string
  isAI: boolean
}

export interface Conversation {
  _id: string
  name: string
  create_date: string
  id_detail: string
  content?: Message[]
} 