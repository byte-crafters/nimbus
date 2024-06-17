'use client';
import { setSearch } from '@/libs/redux/search.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Input, Toolbar, Typography } from '@mui/material';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import styles from './Header.module.scss';
import { Navigation } from './components';

export const Header = ({}: PropsWithChildren) => {
    const dispatch = useAppDispatch();
    const { value: searchValue } = useAppSelector(({ search }) => search);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchValue = e.target.value;
        dispatch(setSearch(newSearchValue));
    };

    return (
        <Box>
            <AppBar position="static" className={styles.bar}>
                <Toolbar className={styles.container}>
                    <Typography variant="h4">Nimbus</Typography>
                    <div className={styles.search}>
                        <SearchIcon sx={{ margin: '5px' }} />
                        <Input
                            placeholder="Search files"
                            value={searchValue}
                            onChange={onChange}
                            fullWidth
                            sx={{ fontSize: 20 }}
                        />
                    </div>
                    <Navigation />
                </Toolbar>
            </AppBar>
        </Box>
    );
};
