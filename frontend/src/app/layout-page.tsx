'use client';
import { ModalProvider } from '@/components/Modal';
import { TFolder, fetcher } from '@/libs/request';
import { ThemeProvider, createTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useState } from 'react';

export type TSetUserProfileShort = {
    loggedUser: string | null;
    setLoggedUser: Function | null;
};

/**
 * Stores folder info about current folder
 */
export type TSetOpenedFolder = {
    openedFolder: TFolder | null;
    setOpenedFolder: ((folder: TFolder) => any) | null;
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
});

export const ProfileContext = createContext<TSetUserProfileShort>({
    loggedUser: null,
    setLoggedUser: null,
});
export const PathContext = createContext<TSetOpenedFolder>({
    openedFolder: null,
    setOpenedFolder: null,
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [loggedUser, setLoggedUser] = useState<string | null>(null);
    const [openedFolder, setOpenedFolder] = useState<TFolder | null>(null);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                if (loggedUser === null) {
                    fetcher.getUserProfile().then((profile) => {
                        console.log(profile);
                        setLoggedUser(profile.id);
                        setOpenedFolder(profile.rootFolder);
                        router.push('/files/my');
                    });
                }
            } catch (e: unknown) {
                throw e;
            }
        })();
    }, []);

    return (
        <ProfileContext.Provider value={{ loggedUser, setLoggedUser }}>
            <PathContext.Provider value={{ openedFolder, setOpenedFolder }}>
                <ThemeProvider theme={theme}>
                    <ModalProvider>{children}</ModalProvider>
                </ThemeProvider>
            </PathContext.Provider>
        </ProfileContext.Provider>
    );
};
