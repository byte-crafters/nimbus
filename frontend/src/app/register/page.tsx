'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useRef } from 'react';
import { PathContext, ProfileContext, TSetOpenedFolder, TSetUserProfileShort } from '../layout-page';
import { register } from '../lib/register-actions';

export default function Auth() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { setLoggedUser } = useContext<TSetUserProfileShort>(ProfileContext);
    const { setOpenedFolder } = useContext<TSetOpenedFolder>(PathContext);
    const router = useRouter();

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const userProfile = await register(loginRef.current!.value, passwordRef.current!.value);

                if (userProfile !== null) {
                    setLoggedUser?.(userProfile.id);
                    setOpenedFolder?.(userProfile.rootFolder);
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
