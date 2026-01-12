# Vibely - Frontend

## About

Vibely is a modern WhatsApp-like messaging application built with React, TypeScript, and Socket.io for real-time communication. This frontend provides an intuitive user interface for instant messaging, user authentication, and contact management.

## Project Description

Vibely frontend offers a seamless messaging experience with:
- Real-time messaging using Socket.io
- User authentication and authorization
- Contact list with search functionality
- Modern and responsive UI with Tailwind CSS
- Type-safe development with TypeScript
- Form validation using React Hook Form and Zod

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Radix UI** - Accessible UI components
- **Sonner** - Toast notifications

## Folder Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── ChatArea.tsx     # Message display area
│   │   ├── ChatRoom.tsx     # Main chat interface
│   │   └── Contacts.tsx     # Contact list sidebar
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── Homepage.tsx     # Main chat page
│   │   └── Signin.tsx       # Authentication page
│   ├── App.tsx              # Main app component
│   ├── Socket.ts            # Socket.io configuration
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── eslint.config.js         # ESLint configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:8000

# Socket.io URL (usually same as backend URL)
VITE_SOCKET_URL=http://localhost:8000
```

### Environment Variable Details

- **VITE_BACKEND_URL**: The base URL for API requests to the backend server
- **VITE_SOCKET_URL**: The URL for Socket.io WebSocket connections (typically the same as backend URL)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vibely/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory and add your environment variables (see above)

4. Ensure the backend server is running on the specified port (default: 8000)

## How to Start

### Development Mode

```bash
npm run dev
```

This starts the Vite development server with hot module replacement (HMR). The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

This compiles TypeScript and builds the production-ready application in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Locally preview the production build before deployment.

### Lint

```bash
npm run lint
```

Run ESLint to check for code quality issues.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.io WebSocket connections
- **Contact Management**: View and search through your contacts
- **User Authentication**: Secure login and registration
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Message Status**: See read/unread status and timestamps
- **Modern UI**: Clean and intuitive interface with smooth animations

## Available Routes

- `/signin` - User authentication page
- `/chat-room` - Main messaging interface with contacts and chat area

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## Development Notes

- The app uses React 19 with modern hooks and patterns
- Socket.io automatically reconnects on connection loss
- All forms use Zod schemas for validation
- UI components are built with Radix UI for accessibility

## Support

For issues or questions, please create an issue in the repository.