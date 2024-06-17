'use client';

import { setMyFiles, setMyFolders } from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import {
    setTrashFiles,
    setTrashFolders,
    setTrashPath,
} from '@/libs/redux/trash-files.reducer';
import { TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

export type TFoldersList = TFolder[];

export type TFolderChildren = {
    folders: TFolder[];
    files: TFile[];
    currentPath: TPath[];
};

export function Bin() {
    const { files, folders, path, openedFolder } = useAppSelector(
        (state) => state.trashFiles
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        updatePage();
    }, []);

    function updatePage() {
        fetcher.getDeletedFolders().then((folders) => {
            dispatch(setTrashFolders(folders));
        });

        console.log(1);
        fetcher.getDeletedFiles().then((files) => {
            console.log(files);
            dispatch(setTrashFiles(files));
        });
    }

    function openFolder(folder: TFolder) {
        if (folder) {
            dispatch(setTrashFolders(folder));
            const folderId = folder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    dispatch(setTrashPath(currentPath));
                    dispatch(setTrashFolders(folders));
                    dispatch(setTrashFiles(files));
                });
        } else {
            updatePage();
        }
    }

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div>
                <Typography variant="h6">Recycle bin</Typography>
                <Breadcrumbs list={path} onClick={openFolder} />
                <Box sx={{ margin: 2 }}>
                    <Browser
                        files={files}
                        folders={folders}
                        openFolder={openFolder}
                        restoreGroup
                    />
                </Box>
            </div>
        </div>
    );
}
