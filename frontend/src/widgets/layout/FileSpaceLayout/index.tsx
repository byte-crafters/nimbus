'use client';
import '@/app/globals.css';
import { Header } from '@/shared/Header';
import { LoadedFiles } from '@/shared/LoadedFiles/LoadedFiles';
import { Sidebar } from '@/shared/Sidebar';
import { UploadFilesProvider } from '@/shared/UploadFilesProvider/UploadFilesProvider';
import { Box } from '@mui/material';
import React from 'react';
import { createPortal } from 'react-dom';

export function FileSpaceLayout({ children }: { children: React.ReactNode; }) {
    return (
        <UploadFilesProvider>
            <Box className="fileSpaceLayout" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Header />
                <Box
                    className="fileSpaceLayout_content"
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
            {
                createPortal(
                    <LoadedFiles />,
                    document.body
                )
            }
        </UploadFilesProvider>
    );
}
