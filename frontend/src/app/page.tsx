import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
    // return <div className={styles.main}>Hello noob</div>
    return (
        <>
            <Link href={'/login'}>Login</Link><br />
            <Link href={'/register'}>Register</Link><br />
            <Link href={'/files'}>Files</Link><br />
        </>
    );
}
