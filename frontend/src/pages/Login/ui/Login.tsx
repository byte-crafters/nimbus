'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef } from 'react';
import { login } from '../lib';
import styles from './Login.module.scss';

export function Login() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    return (
        <div className={styles.container}>
            <div>
                <h1>Login</h1>
                <form
                    onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                        try {
                            e.preventDefault();

                            const username = loginRef.current!.value;
                            const password = passwordRef.current!.value;

                            const userProfile = await login(username, password);

                            if (userProfile !== null) {
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
                        />
                    </div>
                    <input
                        type="submit"
                        value="Login"
                        className={styles.button}
                    />
                </form>
                <Link href={'/register'}>Register</Link>
                <br />
            </div>
        </div>
    );
}
