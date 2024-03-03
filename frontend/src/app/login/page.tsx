'use client';
import React, { FormEvent, useContext, useRef } from 'react';
import { login } from '../lib/login-actions';
import { ProfileContext, TSetUserProfileShort } from '../layout-page';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Auth() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { loggedUser, setLoggedUser } =
        useContext<TSetUserProfileShort>(ProfileContext);
    const router = useRouter();

    return (
        <>
            <h1>Login</h1>
            <form
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const userProfile = await login(
                        loginRef.current!.value,
                        passwordRef.current!.value
                    );
                    if (userProfile.id !== null) {
                        setLoggedUser?.(userProfile.id);
                        router.push('/files');
                    }
                }}
            >
                <div>
                    <div>
                        <label htmlFor="login">Username:</label>
                    </div>
                    <input ref={loginRef} type="text" name="login" />
                </div>
                <div>
                    <div>
                        <label htmlFor="password">Password:</label>
                    </div>
                    <input ref={passwordRef} type="password" name="password" />
                </div>
                <input type="submit" value="Login" />
            </form>
            <Link href={'/register'}>Register</Link>
            <br />
        </>
    );
}
