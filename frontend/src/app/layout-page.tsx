'use client';
import { TFolder, fetcher } from '@/libs/request';
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
            if (loggedUser === null) {
                fetcher.getUserProfile().then((profile) => {
                    console.log(profile);
                    setLoggedUser(profile.id);
                    setOpenedFolder(profile.rootFolder);
                    router.push('/files');
                });
            }
        })();
    }, []);

    return (
        <ProfileContext.Provider value={{ loggedUser, setLoggedUser }}>
            <PathContext.Provider value={{ openedFolder, setOpenedFolder }}>
                {children}
            </PathContext.Provider>
        </ProfileContext.Provider>
    );
};
