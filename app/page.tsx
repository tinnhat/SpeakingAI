// 'use client'
// import { useEffect, useState } from 'react'

import HomePage from './page/homepage'

// export default function Home() {
  // const [isRecording, setIsRecording] = useState(false)
  // const [transcript, setTranscript] = useState('')
  // const [response, setResponse] = useState('')

  // const sendToHuggingFace = async text => {
  //   const res = await fetch(
  //     'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: 'Bearer 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',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ inputs: text }),
  //     }
  //   )
  //   const data = await res.json()
  //   return data[0].generated_text || "Sorry, I didn't understand."
  // }

  // useEffect(() => {
  //   if (!('webkitSpeechRecognition' in window)) return

  //   const recognition = new webkitSpeechRecognition()
  //   recognition.lang = 'en-US'
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   recognition.onresult = async (event: any) => {
  //     const text = event.results[0][0].transcript
  //     setTranscript(text)

  //     const res = await sendToHuggingFace(text)
  //     setResponse(res)
  //     speakResponse(res)

  //     // console.log(data);
  //   }
  //   recognition.onend = () => setIsRecording(false)

  //   if (isRecording) recognition.start()
  //   return () => recognition.stop()
  // }, [isRecording])

  // //speak test
  // const speakResponse = text => {
  //   const utterance = new SpeechSynthesisUtterance(text)
  //   utterance.lang = 'en-US'
  //   window.speechSynthesis.speak(utterance)
  // }
//   return (
//     <div style={{ padding: '20px', textAlign: 'center' }}>
//       <h1>Luyện nói tiếng Anh với AI</h1>
//       <button onClick={() => setIsRecording(true)} disabled={isRecording}>
//         Start
//       </button>
//       <button onClick={() => setIsRecording(false)} disabled={!isRecording}>
//         Stop
//       </button>
//       <p>Bạn nói: {transcript}</p>
//       <p>AI: {response}</p>
//     </div>
//   )
// }

// 'use client'
// import { useState } from 'react'
// import { MicrophoneIcon, PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/solid'

// export default function Home() {
//   const [messages, setMessages] = useState([
//     { id: 1, text: 'Hi, how can I help you today?', isAI: true },
//     { id: 2, text: 'I want to practice English', isAI: false },
//   ])
//   const [isRecording, setIsRecording] = useState(false)
//   const [inputText, setInputText] = useState('')

//   return (
//     <div className='flex h-screen bg-gray-100'>
//       {/* Sidebar */}
//       <div className='w-64 bg-white shadow-lg hidden md:block transition-all duration-300 ease-in-out'>
//         <div className='p-4 border-b'>
//           <h2 className='text-xl font-semibold text-gray-800'>Chat History</h2>
//         </div>
//         <div className='p-4'>
//           <div className='space-y-4'>
//             {/* History items */}
//             <div className='p-3 hover:bg-gray-50 rounded-lg cursor-pointer transform transition duration-200 hover:scale-[1.02]'>
//               <p className='text-sm font-medium text-gray-800'>Conversation 1</p>
//               <p className='text-xs text-gray-500'>2 minutes ago</p>
//             </div>
//             <div className='p-3 hover:bg-gray-50 rounded-lg cursor-pointer transform transition duration-200 hover:scale-[1.02]'>
//               <p className='text-sm font-medium text-gray-800'>Conversation 2</p>
//               <p className='text-xs text-gray-500'>1 hour ago</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Chat Container */}
//       <div className='flex-1 flex flex-col'>
//         {/* Header */}
//         <div className='bg-white shadow-sm p-4'>
//           <h1 className='text-xl font-semibold text-gray-800'>English Practice with AI</h1>
//         </div>

//         {/* Chat Messages */}
//         <div className='flex-1 overflow-y-auto p-4 space-y-4'>
//           {messages.map(message => (
//             <div
//               key={message.id}
//               className={`flex ${message.isAI ? 'justify-start' : 'justify-end'} animate-fade-in`}
//             >
//               <div
//                 className={`max-w-[80%] p-4 rounded-lg shadow-sm transform transition-all duration-200 hover:scale-[1.01] ${
//                   message.isAI ? 'bg-white text-gray-800' : 'bg-blue-500 text-white'
//                 }`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input Area */}
//         <div className='bg-white border-t p-4'>
//           <div className='flex items-center space-x-4 max-w-4xl mx-auto'>
//             <div className='flex-1 relative'>
//               <input
//                 type='text'
//                 value={inputText}
//                 onChange={e => setInputText(e.target.value)}
//                 placeholder='Type your message...'
//                 className='w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
//               />
//               <button className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200'>
//                 <PaperAirplaneIcon className='h-5 w-5' />
//               </button>
//             </div>
//             <button
//               onClick={() => setIsRecording(!isRecording)}
//               className={`p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 ${
//                 isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
//               }`}
//             >
//               {isRecording ? (
//                 <StopIcon className='h-5 w-5 text-white' />
//               ) : (
//                 <MicrophoneIcon className='h-5 w-5 text-white' />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default function Home() {
  return <HomePage />
}
