import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
    borderRadius: '5px',
    backgroundColor: 'transparent',
    color: 'rgb(20, 250, 250)',
    fontSize: '20pt',
    padding: '10px 20px 10px 20px',
    fontWeight: 700,
    _focus: {
      boxShadow: 'none'
    },
    _hover: {
      backgroundColor: 'rgb(2, 12, 62)'
    },
  sizes: {
    sm: {
      fontSize: '100pt'
    },
    md: {
      fontSize: '16pt',
      fontWeight: '100',
    },
    lg: {
      fontSize: '100pt'
    },
  },
  variants: {
    blue: {
      bg: 'blue.500',
      _hover: {
        bg: 'blue.600'
      }
    },
    green: {
      bg: 'green.500',
      _hover: {
        bg: 'green.600'
      }
    },
    red: {
      bg: 'red.500',
      _hover: {
        bg: 'red.600'
      }
    },
  }
})

export const buttonTheme = defineMultiStyleConfig({
  baseStyle,
})