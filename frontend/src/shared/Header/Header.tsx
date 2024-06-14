'use client';
import { setSearch } from '@/libs/redux/search.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Input, Toolbar, Typography } from '@mui/material';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import styles from './Header.module.scss';
import { Navigation } from './components';

export const Header = ({ }: PropsWithChildren) => {
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
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        className={clsx(styles.name)}
                    >
                        Nimbus
                    </Typography>
                    <div className={styles.search}>
                        <SearchIcon />
                        <Input
                            placeholder="Search files"
                            value={searchValue}
                            // disableUnderline
                            onChange={onChange}
                            fullWidth
                            className={styles.input}
                        />
                    </div>
                    <Navigation />
                </Toolbar>
            </AppBar>
        </Box>
    );
};
