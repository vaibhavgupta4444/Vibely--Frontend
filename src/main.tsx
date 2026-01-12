import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner.tsx'
import GlobalContextProvider from './context/GlobalContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <GlobalContextProvider>
    <StrictMode>
      <App />
      <Toaster/>
    </StrictMode>
    </GlobalContextProvider>
  </BrowserRouter>,
)
