import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
import styles from './Welcome.module.scss';
import Image from 'next/image';

const WELCOME_IMG = '/laptop2.png';
export function Welcome() {
    return (
        // <>
        //     <Link href={'/login'}>Login</Link>
        //     <br />
        //     <Link href={'/register'}>Register</Link>
        //     <br />
        //     <Link href={'/files'}>Files</Link>
        //     <br />
        // </>
        <Box className={styles.container}>
            <Typography className={styles.title} variant="h1">
                Nimbus
            </Typography>
            <Box className={styles.flexBox}>
                <Box className={styles.info}>
                    <Typography variant="h2" className={styles.subtitle1}>
                        Easy and secure access to your content
                    </Typography>
                    <Typography variant="h4" className={styles.subtitle2}>
                        Store, share, and collaborate on files and folders from
                        your mobile device, tablet, or computer
                    </Typography>
                    <Button
                        variant="outlined"
                        color="secondary"
                        LinkComponent={Link}
                        className={styles.loginButton}
                        href="/login"
                        size="large"
                        autoCapitalize="false"
                    >
                        Go to Nimbus
                    </Button>
                    <Box className={styles.registerBox}>
                        <Typography variant="h5" className={styles.noAccount}>
                            Don't have an account?
                        </Typography>
                        <Button
                            variant="text"
                            color="secondary"
                            LinkComponent={Link}
                            className={styles.registerButton}
                            href="/register"
                            size="small"
                            autoCapitalize="false"
                        >
                            Sign up
                        </Button>
                    </Box>
                </Box>
                <Box className={styles.imageContainer}></Box>
                <Image
                    src={WELCOME_IMG}
                    alt=""
                    // className={styles.card__image}
                    width={800}
                    height={450}
                />
            </Box>
        </Box>
    );
}
