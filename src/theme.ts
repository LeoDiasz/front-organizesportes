import { createTheme } from '@mui/material/styles';

// Defina suas cores personalizadas
// Você pode usar as cores da sua logo OrganizeEsportes aqui
const organizeBlue = '#03588C'; // Cor primária (azul da logo)
const organizeYellow = '#F2B705'; // Cor secundária (amarelo da logo)

const theme = createTheme({
  palette: {
    primary: {
      main: organizeBlue,
      light: '#335C85',
      dark: '#002244',
      contrastText: '#ffffff',
    },
    secondary: {
      main: organizeYellow,
      light: '#FFE066',
      dark: '#CCAA00',
      contrastText: '#000000',
    },
    // Você pode adicionar outras cores aqui, como error, warning, info, success
    error: {
      main: '#B11C44  ',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Isso pode ser útil para garantir que os ícones do MUI usem a cor do tema
          // Ex: color: 'inherit' para herdar a cor do pai, ou 'primary'/'secondary'
        }
      }
    }
  }
});

export default theme;
