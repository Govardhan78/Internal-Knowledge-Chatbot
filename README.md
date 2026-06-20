# ⚡ IntelliDocs — Internal Knowledge Chatbot

An AI-powered internal knowledge base chatbot that lets employees query company documents using natural language. Admins upload PDFs, the system indexes them into a vector database, and employees get instant AI-generated answers sourced directly from those documents.

---

## 🚀 Features

- **Role-based access** — Admin and Employee roles with protected routes
- **PDF ingestion** — Admin uploads PDFs which are parsed, chunked, and embedded
- **Semantic search** — Questions are matched against document chunks using vector similarity
- **RAG pipeline** — Retrieval-Augmented Generation using Groq LLM (Llama 3.3 70B)
- **Local embeddings** — Runs `all-MiniLM-L6-v2` locally via `@xenova/transformers` (no OpenAI needed)
- **Vector storage** — Pinecone for fast similarity search
- **JWT authentication** — Secure login with 7-day token expiry
- **Chat history** — Every Q&A is persisted per user in MongoDB
- **Clean UI** — Dark-themed React frontend built with Tailwind CSS v4

---

## 🛠 Tech Stack

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | User, document, and chat history storage |
| JWT + bcryptjs | Authentication and password hashing |
| LangChain | PDF loading, text splitting, vector store integration |
| `@xenova/transformers` | Local embedding model (all-MiniLM-L6-v2, 384-dim) |
| Pinecone | Vector database for semantic search |
| Groq SDK | LLM inference (Llama 3.3 70B Versatile) |
| Multer | PDF file upload handling |
| pdf-parse | PDF text extraction |

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + Vite 8 | Frontend framework and build tool |
| React Router v7 | Client-side routing with protected routes |
| Tailwind CSS v4 | Utility-first styling (CSS-first config) |
| Axios | HTTP client with JWT interceptor |

---

## 🏗 Project Structure

```
├── backend/
│   ├── config/           # DB, Pinecone, Groq, embeddings setup
│   ├── controllers/      # Route handler logic
│   ├── middlewares/      # Auth (JWT), role, upload, error handlers
│   ├── models/           # Mongoose schemas (User, Document, Chat)
│   ├── routes/           # Express routers
│   ├── services/         # Business logic (auth, chat, document, retrieval)
│   ├── utils/            # Text splitter, logger
│   ├── uploads/          # Temporary PDF storage (gitignored)
│   └── server.js         # Entry point
│
├── frontend/
│   └── src/
│       ├── api/          # Axios instance with auth interceptor
│       ├── components/   # Navbar, ProtectedRoute, AdminRoute
│       ├── context/      # AuthContext (user state + localStorage)
│       ├── pages/        # Login, Register, ChatPage, Admin
│       ├── routes/       # AppRoutes with role-based guards
│       └── services/     # API call wrappers (auth, chat, documents)
```

---

## ⚙️ How the RAG Pipeline Works

```
Admin uploads PDF
  → PDFLoader extracts text
  → RecursiveCharacterTextSplitter chunks it (500 chars, 100 overlap)
  → all-MiniLM-L6-v2 generates 384-dim embeddings locally
  → Vectors upserted to Pinecone with metadata

Employee asks a question
  → Question embedded with same model
  → Top-3 similar chunks fetched from Pinecone
  → Chunks passed as context to Groq (Llama 3.3 70B)
  → LLM answers strictly from context
  → Answer + Q saved to MongoDB chat history
```

---

## 🔐 Roles & Access

| Feature | Employee | Admin |
|---|---|---|
| Login / Register | ✅ | ✅ |
| Chat with knowledge base | ✅ | ✅ |
| View chat history | ✅ (own only) | ✅ |
| Upload documents | ❌ | ✅ |
| View indexed documents | ❌ | ✅ |

> Roles are set in the database. All users register as `employee` by default. Admin must be assigned manually via DB.

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Pinecone account (create an index with **384 dimensions**, cosine metric)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/intellidocs-knowledge-chatbot.git
cd intellidocs-knowledge-chatbot
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Create an Admin user
Register normally via the UI, then update the role in MongoDB:
```js
db.users.updateOne({ email: "admin@company.com" }, { $set: { role: "admin" } })
```

---

## 📄 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Chat
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/chat` | Employee + Admin |
| GET | `/api/chat/history` | Employee + Admin |

### Documents
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/documents/upload` | Admin only |
| GET | `/api/documents` | Public |

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Key Design Decisions

- **Local embeddings** — Uses `@xenova/transformers` to avoid OpenAI embedding costs. The model downloads once and runs locally.
- **Direct Pinecone queries** — Document indexing and retrieval both use the Pinecone client directly, keeping metadata consistent (`text` field).
- **Single-tenant** — All documents share one Pinecone index. Designed for one company's internal use.
- **Strict RAG prompt** — The LLM is instructed to answer only from provided context, preventing hallucination.
