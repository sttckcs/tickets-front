export const Button = {
  baseStyle: {
    borderRadius: '10px',
    color: 'white',
    fontSize: '10pt',
    fontWeight: 700,
    _focus: {
      boxShadow: 'none'
    }
  },
  sizes: {
    sm: {
      fontSize: '9pt'
    },
    md: {
      fontSize: '10pt'
    },
    lg: {
      fontSize: '12pt'
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