/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewConversationModal } from '@/app/components/modals/NewConversationModal'
import { Conversation } from '@/app/types/conversation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Menu, MessageSquare, Moon, Plus, Sun, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Sidebar = ({
  setIsLoading,
  setIsDarkMode,
  isDarkMode,
  setMessages,
  setCurrentConversationId,
  currentConversationId
}: {
  setIsLoading: (isLoading: boolean) => void
  setIsDarkMode: (isDarkMode: boolean) => void
  isDarkMode: boolean
  setMessages: (messages: any[]) => void
  setCurrentConversationId: (id: string | null) => void
  currentConversationId: string | null
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false)

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversation')
      if (!response.ok) throw new Error('Failed to fetch conversations')
      const data = await response.json()
      setConversations(data.conversations)
    } catch (error: unknown) {
      console.error('Error fetching conversations:', error)
      toast.error('Failed to load conversations')
    }
  }

  const handleConversationClick = async (conversationId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversation/${conversationId}`)
      if (!response.ok) throw new Error('Failed to fetch conversation')

      const data = await response.json()
      setMessages(data.conversation.details.content || [])
      setCurrentConversationId(conversationId)
    } catch (error: unknown) {
      console.error('Error loading conversation:', error)
      toast.error('Failed to load conversation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNewConversation = async (name: string) => {
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          content: [{ id: 1, text: 'Hi, how can I help you today?', isAI: true }],
        }),
      })

      if (!response.ok) throw new Error('Failed to create conversation')

      const data = await response.json()
      await fetchConversations()
      handleConversationClick(data.conversation._id)
      toast.success('New conversation created')
    } catch (error: unknown) {
      console.error('Error loading conversation:', error)
      toast.error('Failed to create conversation')
    }
  }

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/conversation/${conversationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete conversation')

      if (conversationId === currentConversationId) {
        setMessages([])
        setCurrentConversationId(null)
      }

      await fetchConversations()
      toast.success('Conversation deleted')
    } catch (error: unknown) {
      console.error('Error loading conversation:', error)
      toast.error('Failed to delete conversation')
    }
  }

  return (
    <>
      <NewConversationModal
        isOpen={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
        onSubmit={handleCreateNewConversation}
      />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className='md:hidden fixed top-2 left-2 z-50 p-2 rounded-full bg-white dark:bg-slate-800 shadow-md'
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} className='text-primary' />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          'w-72 bg-white dark:bg-slate-800 shadow-xl fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out transform',
          'md:translate-x-0 md:relative',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='p-5 border-b dark:border-slate-700'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-primary dark:text-white'>English AI</h2>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsDarkMode(!isDarkMode)}
              className='rounded-full'
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>

        <div className='p-4'>
          <Button
            variant='outline'
            className='w-full justify-start mb-6 gap-2'
            onClick={() => setIsNewConversationModalOpen(true)}
          >
            <Plus size={16} /> New Conversation
          </Button>

          <h3 className='text-sm font-medium text-muted-foreground mb-3'>Recent Conversations</h3>
          <div className='space-y-2'>
            {conversations.map(conversation => (
              <div
                key={conversation._id}
                className='p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer group'
                onClick={() => handleConversationClick(conversation._id)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <MessageSquare size={16} className='text-primary' />
                    <p className='text-sm font-medium'>{conversation.name}</p>
                  </div>
                  <div className='flex items-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7 cursor-pointer'
                      onClick={e => handleDeleteConversation(e, conversation._id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div className='flex items-center mt-1 text-xs text-muted-foreground'>
                  <Clock size={12} className='mr-1' />
                  {formatDistanceToNow(new Date(conversation.create_date), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default Sidebar
