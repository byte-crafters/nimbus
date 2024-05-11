import { Header } from '@/shared/Header';
import { Box } from '@mui/material';
import React from 'react';

export function FileSpaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ height: '100%' }}>
            <Header />
            <Box sx={{ display: 'flex', height: '639px' }}>
                {/* <Sidebar /> */}
                {children}
            </Box>
        </Box>
    );
}
