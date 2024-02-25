// 'use server';
'use client';
import { cookies } from 'next/headers';
import { FormEvent } from 'react';
import { ProfileContext } from '../layout-page';

export async function register(login: string, password: string) {

    try {
        console.log(login, password);
        const res: { access_token: string; } = await fetch(`${process.env.NEXT_PUBLIC_NIMBUS_API_HOST}/api/v1/auth/register`, {
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
            const userProfile = await fetch(`${process.env.NEXT_PUBLIC_NIMBUS_API_HOST}/api/v1/auth/profile`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json());

            console.log(userProfile);
            console.log(1);

            return userProfile;
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
