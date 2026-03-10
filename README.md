# Speaking AI

An English speaking practice application powered by AI, featuring voice input (Speech-to-Text) and voice response (Text-to-Speech). Uses the `google/flan-t5-base` model from HuggingFace.

## Tech Stack

| Layer     | Technology                                          |
| --------- | --------------------------------------------------- |
| Framework | Next.js 15 (App Router)                             |
| Frontend  | React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui   |
| Backend   | Next.js Route Handlers (REST API)                   |
| Database  | MongoDB + Mongoose 8                                |
| AI Model  | HuggingFace Inference API (`HuggingFaceH4/zephyr-7b-beta`) |
| Voice     | Web Speech API (STT), SpeechSynthesis API (TTS)     |
| Deploy    | Vercel                                              |

## Features

- **AI Chat** - Type a message, get an automatic AI response
- **Voice Input** - Press the microphone button to speak, automatically transcribed and sent to AI
- **Voice Output** - AI reads responses aloud via Text-to-Speech
- **Conversation Management** - Create, view, and delete conversations
- **Conversation History** - Persist and reload previous conversations
- **Dark Mode** - Toggle between light and dark themes
- **Responsive** - Mobile-friendly with collapsible sidebar

## Project Structure

```
app/
  page.tsx                          # Entry point -> HomePage
  layout.tsx                        # Root layout (Geist font, metadata)
  globals.css                       # Global styles, CSS variables, dark mode
  api/
    conversation/
      route.ts                      # GET (list all), POST (create)
      [id]/route.ts                 # GET, PUT, DELETE (by ID)
  component/
    containerChat/index.tsx         # Main chat interface (input, voice, messages)
    historySideBar/index.tsx         # Conversation history sidebar, dark mode toggle
  components/
    modals/
      NewConversationModal.tsx      # New conversation dialog
  lib/
    mongodb.ts                      # MongoDB connection (singleton)
  models/
    conversation.ts                 # Mongoose schemas (Conversation, DetailConversation)
  types/
    conversation.ts                 # TypeScript interfaces (Message, Conversation)
  page/
    homepage/index.tsx              # HomePage - main state hub of the app
components/
  ui/
    button.tsx                      # shadcn/ui Button
    dialog.tsx                      # shadcn/ui Dialog
    input.tsx                       # shadcn/ui Input
lib/
  utils.ts                          # cn() utility (clsx + tailwind-merge)
```

## Architecture

### Frontend

`HomePage` (`app/page/homepage/index.tsx`) is the central state hub, managing:

- `messages` - Current message list
- `currentConversationId` - Currently selected conversation ID
- `isDarkMode` - Dark mode state
- `isLoading` - Loading state

State is passed down to 2 child components via props:

- **Sidebar** - Displays conversation list, create/delete conversations, dark mode toggle
- **ContainerChat** - Displays messages, text input, voice input, sends messages to AI

### Backend (API Routes)

| Method   | Endpoint                    | Description                    |
| -------- | --------------------------- | ------------------------------ |
| `GET`    | `/api/conversation`         | List all conversations         |
| `POST`   | `/api/conversation`         | Create a new conversation      |
| `GET`    | `/api/conversation/[id]`    | Get conversation details       |
| `PUT`    | `/api/conversation/[id]`    | Update conversation content    |
| `DELETE` | `/api/conversation/[id]`    | Delete a conversation          |

### Database

2 collections with a 1:1 relationship:

- **Conversation** - `{ name, create_date, id_detail }` (metadata)
- **DetailConversation** - `{ content: [{ id, text, isAI }] }` (message content)

Linked via the `id_detail` field (ObjectId ref).

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- HuggingFace API key

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Configure environment

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/speaking-ai
NEXT_PUBLIC_HUGGINGFACE_API_KEY=hf_your_api_key_here
```

| Variable                            | Description                              | Scope       |
| ----------------------------------- | ---------------------------------------- | ----------- |
| `MONGODB_URI`                       | MongoDB connection string                | Server-side |
| `NEXT_PUBLIC_HUGGINGFACE_API_KEY`   | HuggingFace Inference API key            | Client-side |

> Get a HuggingFace API key at: https://huggingface.co/settings/tokens

### Step 3: Run the application

```bash
# Development
npm run dev

# Production
npm run build && npm run start
```

Open http://localhost:3000

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start dev server (port 3000)   |
| `npm run build`  | Production build               |
| `npm run start`  | Start production server        |
| `npm run lint`   | Run ESLint                     |

## Notes

- **Browser Support**: Voice input requires `webkitSpeechRecognition` (Chrome, Edge). Firefox and Safari do not fully support it.
- **AI Model**: Currently uses `HuggingFaceH4/zephyr-7b-beta` (7B conversational model with English tutor system prompt). You can switch to a different model by updating the URL and prompt format in `app/component/containerChat/index.tsx`.
- **API Key Security**: `NEXT_PUBLIC_HUGGINGFACE_API_KEY` is exposed client-side. For production, consider proxying requests through a server-side API route.
