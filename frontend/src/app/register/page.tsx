'use client';
import React, { FormEvent, useRef } from 'react';
import { register } from '../lib/register-actions';
// import { authenticate } from '@/app/lib/actions';

export default function Auth() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                register(loginRef.current!.value, passwordRef.current!.value);
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
        </>
    );
}
