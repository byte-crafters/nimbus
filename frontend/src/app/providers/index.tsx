'use client';
import { ModalProvider } from '@/components/Modal';
import { store } from '@/libs/redux/store';
import { TFolder } from '@/libs/request';
import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';

export type TSetUserProfileShort = {
    loggedUser: string | null;
    setLoggedUser: Function | null;
};

/**
 * Stores folder info about current folder
 */
export type TSetOpenedFolder = {
    openedFolder: TFolder | null;
    setOpenedFolder: ((folder: TFolder | null) => any) | null;
};

const theme = createTheme({
    //move
    palette: {
        primary: {
            main: '#FFFFFF',
            light: '#E0C2FF',
        },
        secondary: {
            main: '#000000',
            light: '#F5EBFF',
        },
    },
    typography: {
        h4: {
            fontSize: 30,
            paddingLeft: '50px',
            fontWeight: 'bold',
            fontStyle: 'oblique',
            fontFamily: 'sans-serif',
            letterSpacing: 2,
        },
        h6: {
            fontSize: 24,
            padding: '10px',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
        },
        body1: { fontSize: 16, fontWeight: 'normal' },
        body2: {
            fontSize: 18,
        },
        subtitle1: {
            fontSize: 20,
        },
        subtitle2: {
            fontSize: 20,
            cursor: 'pointer',
        },
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

const App = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <ModalProvider>{children}</ModalProvider>
            </ThemeProvider>
        </Provider>
    );
};

export default App;
