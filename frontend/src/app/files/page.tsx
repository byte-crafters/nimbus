'use client';
import React, { FormEvent, useRef } from 'react';
// import { authenticate } from '@/app/lib/actions';

export default function FilesContainer() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <h1>Files</h1>
            <button>Create text file</button>
            <button>Create folder</button>

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
