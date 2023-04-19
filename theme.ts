import { MD3LightTheme as DefaultTheme, MD3Theme } from 'react-native-paper'

const theme: MD3Theme = {
    
    ...DefaultTheme,
    version: 3,
    colors: {
        ...DefaultTheme.colors,
        onSurface: '#212121',
        primaryContainer: '#FFFFFF',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        primary: '#42A5F5',
        secondary: 'yellow'
    },
};

export default theme