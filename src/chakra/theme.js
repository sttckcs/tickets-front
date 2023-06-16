import { extendTheme } from "@chakra-ui/react"
import { Button } from './button'
import { Modal } from './modal'

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: '#000b5e'
    },
  },
  fonts: {
    body: 'Segoe UI'
  },
  styles: {
    global: () => ({
      main: {
        bg: 'gray.400',
      }
    })
  },
  components: {
    Button,
    Modal
  }
})
