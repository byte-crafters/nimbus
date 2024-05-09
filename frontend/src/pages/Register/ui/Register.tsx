'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useRef } from 'react';
import {
    PathContext,
    ProfileContext,
    TSetOpenedFolder,
    TSetUserProfileShort,
} from '@/app/providers';
import { register } from '../lib/register-actions';
import styles from './Register.module.scss';

export function Register() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { setLoggedUser } = useContext<TSetUserProfileShort>(ProfileContext);
    const { setOpenedFolder } = useContext<TSetOpenedFolder>(PathContext);
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div>
                <h1>Register</h1>
                <form
                    onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                        try {
                            e.preventDefault();

                            const userProfile = await register(
                                loginRef.current!.value,
                                passwordRef.current!.value
                            );

                            if (userProfile !== null) {
                                setLoggedUser?.(userProfile.id);
                                setOpenedFolder?.(userProfile.rootFolder);
                                router.push('/files/my');
                            }
                        } catch (e: unknown) {}
                    }}
                >
                    <div>
                        <div>
                            <label htmlFor="login">Username:</label>
                        </div>
                        <input
                            ref={loginRef}
                            type="text"
                            name="login"
                            className={styles.input}
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <div>
                            <label htmlFor="password">Password:</label>
                        </div>
                        <input
                            ref={passwordRef}
                            type="password"
                            name="password"
                            className={styles.input}
                            autoComplete="off"
                            formNoValidate
                        />
                    </div>
                    <input
                        type="submit"
                        value="Register"
                        className={styles.button}
                    />
                </form>
                <Link href={'/login'}>Login</Link>
                <br />
            </div>
        </div>
    );
}
