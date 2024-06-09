'use client'
import { Header } from '@/shared/Header';
import { Sidebar } from '@/shared/Sidebar';
import { Box } from '@mui/material';
import React from 'react';

export function FileSpaceLayout({ children }: { children: React.ReactNode; }) {
    return (
        <Box>
            <Header />
            

            <Box sx={{ display: 'flex' }}>
                <Sidebar
                    onCreateFolder={() => { }}
                    onUploadFile={() => { }}
                />
                {children}
            </Box>
        </Box>
    );
}
