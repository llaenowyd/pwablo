import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { DeviceProvider } from './device'
import { ReduxProvider } from './state'
import { ThemeProvider } from './theme'
import App from './views/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DeviceProvider>
      <ReduxProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ReduxProvider>
    </DeviceProvider>
  </StrictMode>
)
