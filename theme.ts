import { MD3LightTheme as DefaultTheme } from 'react-native-paper'

const theme = {
    ...DefaultTheme,
    version: 3,
    colors: {
        ...DefaultTheme.colors,
        primaryContainer: 'red',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        primary: 'blue',
        secondary: 'yellow',
    },
};

export default theme