import { extendTheme } from "@chakra-ui/react"
import { Button } from './button'

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: '#000b5e'
    },
  },
  fonts: {
    body: 'Open Sans'
  },
  styles: {
    global: () => ({
      main: {
        bg: 'grey.200',
      }
    })
  },
  components: {
    Button
  }
})
