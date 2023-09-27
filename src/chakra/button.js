export const Button = {
  baseStyle: {
    borderRadius: '5px',
    backgroundColor: 'red',
    fontSize: '50px',
    fontWeight: 700,
    _focus: {
      boxShadow: 'none'
    }
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
}