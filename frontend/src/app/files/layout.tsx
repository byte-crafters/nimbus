import { Header } from '@/components';
import { Sidebar } from '@/components/Sidebar';
import { Box, Container } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { PathContext, ProfileContext } from '../layout-page';
import { TFoldersList } from './my/page';
import { TFile, TPath, fetcher } from '@/libs/request';
import { useRouter } from 'next/router';

export default function FileSpaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const { openedFolder, setOpenedFolder } = useContext(PathContext);
    // const { loggedUser } = useContext(ProfileContext);
    // const [showFoldersList, setShowFolders] = useState<TFoldersList>([]);
    // const [files, setFiles] = useState<TFile[]>([]);
    // const [path, setPath] = useState<TPath[]>([]);
    // const router = useRouter();

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
