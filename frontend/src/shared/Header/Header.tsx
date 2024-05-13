"use client";
import { AccountCircle } from '@mui/icons-material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import {
    AppBar,
    Badge,
    Box,
    IconButton,
    Input,
    Toolbar,
    Typography,
} from '@mui/material';
import { PropsWithChildren } from 'react';
import styles from './Header.module.scss';
import { fetcher } from '@/libs/request';
import { useRouter } from 'next/navigation';

export const Header = ({ }: PropsWithChildren) => {

    const router = useRouter();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                // color="secondary"
                className={styles.bar}
            >
                <Toolbar className={styles.container}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        className={styles.name}
                    >
                        Nimbus
                    </Typography>
                    <div className={styles.search}>
                        <SearchIcon />
                        <Input
                            placeholder="Search files"
                            // disableUnderline
                            fullWidth
                            className={styles.input}
                        />
                    </div>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            aria-label="show 4 new mails"
                            color="inherit"
                        >
                            <Badge badgeContent={2} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={1} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            onClick={async () => {
                                await fetcher.signout();
                                router.push('/login');
                            }}
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            // aria-controls={menuId}
                            aria-haspopup="true"
                            // onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
