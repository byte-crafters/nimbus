import { Header } from '@/components';
import { Sidebar } from '@/components/Sidebar';
import { Box, Container } from '@mui/material';
import React from 'react';

export default function FileSpaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ height: '100%' }}>
            <Header />
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                {children}
            </Box>
        </Box>
    );
}
