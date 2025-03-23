/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from '@/app/types/conversation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Mic, Send, StopCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const ContainerChat = ({
  isLoading,
  isDarkMode,
  messages,
  setMessages,
  currentConversationId,
}: {
  isLoading: boolean
  isDarkMode: boolean
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  currentConversationId: string | null
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isKeyPressed = useRef(false)
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const sendToHuggingFace = async (text: string) => {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    )
    const data = await res.json()
    return data[0].generated_text || "Sorry, I didn't understand."
  }

  // Update the speech recognition effect
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    // Configure recognition
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = async (event: any) => {
      setIsSubmitting(true)
      try {
        const text = event.results[0][0].transcript

        const newMessage: Message = {
          id: messages.length + 1,
          text: text,
          isAI: false,
        }
        // Update messages with user's speech
        setMessages((prevMessages:Message[]) => [...prevMessages, newMessage])
        // Get AI response
        const result = await sendToHuggingFace(text)
        const responseAI: Message = {
          id: messages.length + 2,
          text: result,
          isAI: true,
        }

        // Speak and update messages with AI response
        speakResponse(result)
        setMessages(prevMessages => [...prevMessages, responseAI])

        // Save to database if in a conversation
        if (currentConversationId) {
          await fetch(`/api/conversation/${currentConversationId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: [...messages, newMessage, responseAI],
            }),
          })
        }
      } catch (error) {
        console.error('Error processing speech:', error)
        toast.error('Failed to process speech')
      } finally {
        setIsSubmitting(false)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      toast.error('Error with speech recognition')
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    // Start/Stop recognition based on isRecording state
    if (isRecording) {
      try {
        recognition.start()
      } catch (error) {
        console.error('Failed to start recording:', error)
        setIsRecording(false)
      }
    }

    // Cleanup
    return () => {
      try {
        recognition.stop()
      } catch (error) {
        console.error('Failed to stop recording:', error)
      }
    }
  }, [isRecording, messages, currentConversationId])

  //speak test
  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    window.speechSynthesis.speak(utterance)
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentConversationId) return
    setIsSubmitting(true)
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isAI: false,
    }

    setMessages(prevMessages => [...prevMessages, newMessage])
    setInputText('')

    try {
      const result = await sendToHuggingFace(inputText)
      const responseAI = {
        id: messages.length + 2,
        text: result,
        isAI: true,
      }

      const response = await fetch(`/api/conversation/${currentConversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: [...messages, newMessage, responseAI],
        }),
      })

      if (!response.ok) throw new Error('Failed to update conversation')

      setMessages(prevMessages => [...prevMessages, responseAI])
    } catch (err: unknown) {
      console.error('Error sending message:', err)
      toast.error('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isKeyPressed.current) {
      e.preventDefault()
      e.stopPropagation()
      isKeyPressed.current = true
      setTimeout(() => {
        isKeyPressed.current = false
        handleSendMessage()
      }, 50)
    }
  }

  // Update the recording toggle function
  const toggleRecording = () => {
    if (!currentConversationId) return
    setIsRecording(prev => !prev)
  }

  return (
    <div className='flex-1 flex flex-col md:ml-0 relative'>
      {/* Header */}
      <div className='bg-white dark:bg-slate-800 shadow-sm p-4 border-b dark:border-slate-700'>
        <div className='flex items-center justify-between max-w-4xl mx-auto'>
          <h1 className='text-xl font-bold text-primary dark:text-white ml-8 md:ml-0'>
            English Practice with AI
          </h1>
          {/* <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='hidden md:flex'
              onClick={handleEndConversation}
              disabled={!currentConversationId}
            >
              <MessageSquareX size={16} className='mr-2' /> End Conversation
            </Button>
          </div> */}
        </div>
      </div>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full'>
        {isLoading ? (
          <div className='h-full flex flex-col items-center justify-center space-y-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent'></div>
            <p className='text-sm text-muted-foreground'>Loading conversation...</p>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => (
              <div
                key={`${message.id}-${idx}`}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={cn(
                    'max-w-[80%] p-4 rounded-2xl shadow-sm animate-fade-in',
                    message.isAI
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                      : 'bg-primary text-primary-foreground rounded-tr-sm'
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className='bg-white dark:bg-slate-800 border-t dark:border-slate-700 p-4'>
        <div className='flex items-center space-x-2 max-w-4xl mx-auto'>
          <div className='flex-1 relative'>
            <Input
              type='text'
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentConversationId
                  ? 'Type your message...'
                  : 'Select or create a conversation to start chatting'
              }
              disabled={!currentConversationId || isSubmitting}
              className='pr-10 py-6 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || !currentConversationId || isSubmitting}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
              variant='ghost'
              size='icon'
            >
              <Send
                size={18}
                className={inputText.trim() ? 'text-primary' : 'text-muted-foreground'}
              />
            </Button>
          </div>
          <Button
            onClick={toggleRecording}
            variant={isRecording ? 'destructive' : 'default'}
            size='icon'
            className='h-12 w-12 rounded-full shadow-md transition-all duration-300 hover:scale-105'
            disabled={!currentConversationId || isSubmitting}
          >
            {isRecording ? <StopCircle className='h-5 w-5' /> : <Mic className='h-5 w-5' />}
          </Button>
        </div>
        <div className='text-xs text-center mt-2 text-muted-foreground'>
          {isRecording ? 'Recording... Click to stop' : 'Press the microphone to start speaking'}
        </div>
      </div>
    </div>
  )
}

export default ContainerChat
