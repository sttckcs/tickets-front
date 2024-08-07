import { extendTheme } from "@chakra-ui/react"
import { modalTheme } from "../components/ModalTheme"
import { Button } from './button'
import { Modal } from './modal'
import { buttonTheme } from "../components/ButtonTheme"

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  colors: {
    brand: {
      100: '#000b5e'
    },
  },
  fonts: {
    body: 'Teko-Regular'
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

export const theme = extendTheme({ config, components: { Modal: modalTheme, Button: buttonTheme } })
