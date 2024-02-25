
'use client';
import { useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

export type TSetUserProfileShort = {
    loggedUser: string | null,
    setLoggedUser: Function | null;
};

export type TSetOpenedFolder = {
    openedFolder: string | null,
    setOpenedFolder: Function | null;
};


export const ProfileContext = createContext<TSetUserProfileShort>({ loggedUser: null, setLoggedUser: null });
export const PathContext = createContext<TSetOpenedFolder>({ openedFolder: null, setOpenedFolder: null });

export const Providers = ({ children }: { children: React.ReactNode; }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const [openedFolder, setOpenedFolder] = useState(null);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (loggedUser === null) {
                const getProfile = await fetch(`${process.env.NEXT_PUBLIC_NIMBUS_API_HOST}/api/v1/auth/profile`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })
                    .then((response) => {
                        if (response.ok)
                            return response.json();
                        else
                            // console.log('NOT ok', response);
                            throw new Error('NOT okeey');
                    })
                    .then((profile) => {
                        console.log(profile);
                        setLoggedUser?.(profile.id);
                        router.push('/files');
                    })
                    .catch((e: any) => {
                        console.log('catched!:', e);
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