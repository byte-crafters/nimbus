'use client';
import React, { FormEvent, useRef } from 'react';
import { login } from '../lib/login-actions';

export default function Auth() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                login(loginRef.current!.value, passwordRef.current!.value);
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
                <input type="submit" value="Login" />
            </form>
        </>
    );
}
