import { ThemeProvider } from 'react-jss'

import themes from './themes'

const themeName = 'arcade'
const theme = themes[themeName]

export default ({children}) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
