import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PathContext, ProfileContext, Providers } from './layout-page';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import React from 'react';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <html lang="en">
                <body className={inter.className} style={{ margin: 0 }}>
                    {children}
                </body>
            </html>
        </Providers>
    );
}
