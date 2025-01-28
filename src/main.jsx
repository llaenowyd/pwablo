import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'
import Display from './display'
import { ReduxProvider } from './state'
import { ThemeProvider } from './theme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Display>
      <ReduxProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ReduxProvider>
    </Display>
  </StrictMode>
)
