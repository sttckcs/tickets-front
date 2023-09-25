export const Button = {
  baseStyle: {
    borderRadius: '20px',
    color: 'black',
    fontSize: '20pt',
    fontWeight: 700,
    _focus: {
      boxShadow: 'none'
    }
  },
  sizes: {
    sm: {
      fontSize: '40pt'
    },
    md: {
      fontSize: '40pt'
    },
    lg: {
      fontSize: '40pt'
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