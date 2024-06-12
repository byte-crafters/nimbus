'use client';
import { setMyFiles, setMyFolders, setMyOpenedFolder, setMyPath } from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { TFolder, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import './style.css';

export function MyFiles() {
    const { files, folders, path, openedFolder } = useAppSelector((state) => state.myFiles);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (openedFolder !== null) {
            const folderId = openedFolder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    dispatch(setMyPath(currentPath));
                    dispatch(setMyFiles(files));
                    dispatch(setMyFolders(folders));
                });
        } else {
            fetcher.getUserRootFolder().then(({ parentFolder }) => {
                dispatch(setMyOpenedFolder(parentFolder));
            });
        }
    }, [openedFolder]);

    function openFolder(folder: TFolder) {
        dispatch(setMyOpenedFolder(folder));
    }

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div>
                <Typography variant="h6">My files</Typography>
                <Breadcrumbs list={path} onClick={openFolder} />
                <Box sx={{ margin: 2 }}>
                    <Browser
                        files={files}
                        folders={folders}
                        openFolder={openFolder}
                    />
                </Box>
            </div>
        </div>
    );
}
