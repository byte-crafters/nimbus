import { Header } from '@/shared/Header';
import { Box } from '@mui/material';
import React from 'react';

export function FileSpaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box>
            <Header />
            <Box sx={{ display: 'flex' }}>
                {/* <Sidebar /> */}
                {children}
            </Box>
        </Box>
    );
}
