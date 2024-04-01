import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Link href={'/login'}>Login</Link>
            <br />
            <Link href={'/register'}>Register</Link>
            <br />
            <Link href={'/files'}>Files</Link>
            <br />
        </>
    );
}
