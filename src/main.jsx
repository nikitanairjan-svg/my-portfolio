import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CURSORS } from './components/cursors'

// Page-wide custom cursors (used by the cursor rules in index.css).
document.documentElement.style.setProperty('--cursor-arrow', CURSORS.board.css)
document.documentElement.style.setProperty('--cursor-hand', CURSORS.pointer.css)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
