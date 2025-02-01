import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'
import Device from './device'
import { ReduxProvider } from './state'
import { ThemeProvider } from './theme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Device>
      <ReduxProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ReduxProvider>
    </Device>
  </StrictMode>
)
