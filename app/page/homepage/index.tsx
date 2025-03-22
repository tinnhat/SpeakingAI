'use client'

import ContainerChat from '@/app/component/containerChat'
import Sidebar from '@/app/component/historySideBar'
import { Toaster } from 'sonner'
import { Message } from '@/app/types/conversation'
import { useState } from 'react'

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  return (
    <>
      <div className='flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 transition-colors duration-300 dark:from-slate-900 dark:to-slate-800'>
        <Sidebar
          setIsLoading={setIsLoading}
          setIsDarkMode={setIsDarkMode}
          isDarkMode={isDarkMode}
          setMessages={setMessages}
          setCurrentConversationId={setCurrentConversationId}
          currentConversationId={currentConversationId}
        />
        <ContainerChat
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          messages={messages}
          setMessages={setMessages}
          currentConversationId={currentConversationId}
          
        />
      </div>
      <Toaster theme={isDarkMode ? "dark" : "light"} />
    </>
  )
}

export default HomePage
