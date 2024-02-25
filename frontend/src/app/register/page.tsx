'use client';
import React, { FormEvent, useContext, useRef } from 'react';
import { register } from '../lib/register-actions';
import { ProfileContext, TSetUserProfileShort } from '../layout-page';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { authenticate } from '@/app/lib/actions';

export default function Auth() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { loggedUser, setLoggedUser } = useContext<TSetUserProfileShort>(ProfileContext);
    const router = useRouter();

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const userProfile = await register(loginRef.current!.value, passwordRef.current!.value);
                if (userProfile.id !== null) {
                    setLoggedUser?.(userProfile.id);
                    router.push('/files');
                }
            }}>
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
                <input type="submit" value="Register" />
            </form>
            <Link href={'/login'}>Login</Link><br />
        </>
    );
}
