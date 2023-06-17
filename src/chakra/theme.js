import { extendTheme } from "@chakra-ui/react"
import { Button } from './button'
import { Modal } from './modal'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
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
      }
    })
  },
  components: {
    Button,
    Modal
  },
}

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({ config })
