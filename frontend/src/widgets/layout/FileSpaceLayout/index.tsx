'use client';
import { Header } from '@/shared/Header';
import { Sidebar } from '@/shared/Sidebar';
import { Box } from '@mui/material';
import React from 'react';
import '@/app/globals.css';

export function FileSpaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '1520px',
                    height: '635px',
                    margin: '0 auto',
                }}
            >
                <Sidebar />
                {children}
            </Box>
        </Box>
    );
}
