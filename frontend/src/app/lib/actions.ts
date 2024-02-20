// 'use server';
'use client';
import { cookies } from 'next/headers';
import { FormEvent } from 'react';

export async function authenticate(login: string, password: string) {

    try {
        console.log(login, password);
        const res: { access_token: string; } = await fetch(`${process.env.NEXT_PUBLIC_NIMBUS_API_HOST}/api/v1/auth/login`, {
            body: JSON.stringify({
                username: login,
                password: password
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
    } catch (error: any) {
        if (error) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
};;
