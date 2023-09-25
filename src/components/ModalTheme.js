import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  overlay: {
    bg: 'blackAlpha.200', //change the background
  },
  header: {
    fontSize: '2.5rem',
    fontFamily: 'Teko-Regular',
    color: `rgb(38, 40, 124)`
  },
  dialog: {
    fontSize: '1.5rem',
    borderRadius: 'md',
    bg: `rgb(6, 4, 22)`,
  },
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
})