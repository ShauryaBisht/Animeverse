import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'
import Header from './Components/Header.jsx'
import Footer from './Components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <Header />
    <App />
    <Footer />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
