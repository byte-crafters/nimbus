'use client';
import React, { FormEvent, useRef } from 'react';
import { authenticate } from '@/app/lib/actions';

export default function Auth() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            authenticate(loginRef.current!.value, passwordRef.current!.value);
        }}>
            <input ref={loginRef} type="text" name="login" />
            <input ref={passwordRef} type="password" name="password" />
            <input type="submit" value="login" />
        </form>
    );
}
