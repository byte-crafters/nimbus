import { Box, Divider, Drawer, Toolbar } from '@mui/material';
import styles from './Sidebar.module.scss';
import { PropsWithChildren } from 'react';

export const Sidebar = ({}: PropsWithChildren) => {
    return <Toolbar className={styles.drawer} />;
};
