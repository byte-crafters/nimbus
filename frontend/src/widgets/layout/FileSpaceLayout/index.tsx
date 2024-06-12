'use client';
import { Header } from '@/shared/Header';
import { Sidebar } from '@/shared/Sidebar';
import { Box } from '@mui/material';
import React from 'react';
import '@/app/globals.css';

export function FileSpaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box>
            <Header />
            <Box
                sx={{
                    width: '1520px',
                    margin: '0 auto',
                }}
            >
                <Sidebar />
                {children}
            </Box>
        </Box>
    );
}
