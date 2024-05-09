'use client';
import { TFolder, TGetUserProfile, fetcher } from '@/libs/request';

export type TRegisterReturn = {
    email: string;
    id: string;
    password: string;
    rootFolder: TFolder;
    username: string;
};

export async function register(
    login: string,
    password: string
): Promise<TGetUserProfile | null> {
    try {
        const res: { access_token: string } = await fetcher.register(
            login,
            password
        );
        console.log(res);

        if (res.access_token) {
            const userProfile = await fetcher.getUserProfile();
            return userProfile;
        }

        return null;
    } catch (e: unknown) {
        console.log(e);
        throw e;
    }
}
