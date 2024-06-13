import { fetcher } from '@/libs/request';
import { Box, Link, Menu, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useEffect, useState } from 'react';

interface IProps {}

export const Navigation = ({}: PropsWithChildren<IProps>) => {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );

    useEffect(() => {
        fetcher.getUserProfile().then(({ username }) => {
            setName(username);
        });
    }, []);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Link
                component="button"
                variant="body1"
                onClick={handleOpenUserMenu}
                sx={{ color: 'black', textDecoration: 'hover' }}
            >
                {name}
            </Link>
            <Menu
                sx={{ mt: '25px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem
                    onClick={async () => {
                        await fetcher.signout();
                        router.push('/login');
                    }}
                >
                    <Typography textAlign="center">Logout</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
};
