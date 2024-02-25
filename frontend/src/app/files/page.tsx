'use client';
import React, { FormEvent, createContext, useContext, useEffect, useRef } from 'react';
import { PathContext, ProfileContext } from '../layout-page';
import { useRouter } from 'next/navigation';
// import { authenticate } from '@/app/lib/actions';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */


export default function FilesContainer() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { openedFolder } = useContext(PathContext);
    const { loggedUser } = useContext(ProfileContext);

    const router = useRouter();

    useEffect(() => {
        // move this logic in template or layout
        console.log(loggedUser);
        if (loggedUser === null) {
            router.push('/login');
        }
    });

    return (
        <>
            <h1>Files</h1>


            <br />
            <h2>Current user: `{loggedUser}`</h2>
            <br />
            <h2>Current path: `{openedFolder}`</h2>
            <br />
            <button onClick={async () => {
                const folderName = prompt('Folder name:');

                const res: { access_token: string; } = await fetch(`${process.env.NEXT_PUBLIC_NIMBUS_API_HOST}/api/v1/files/folder`, {
                    body: JSON.stringify({
                        folder: folderName,
                    }),
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then((response) => response.json());


                if (res.access_token) {
                    const getProfile = await fetch(`${process.env.NEXT_PUBLIC_NIMBUS_API_HOST}/api/v1/auth/profile`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }).then((response) => response.json());

                    console.log(getProfile);
                    console.log(1);
                }
            }}>Create folder</button>

            {/* <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                authenticate(loginRef.current!.value, passwordRef.current!.value);
            }}>
                <input ref={loginRef} type="text" name="login" />
                <input ref={passwordRef} type="password" name="password" />
                <input type="submit" value="login" />
            </form> */}
        </>
    );
}
