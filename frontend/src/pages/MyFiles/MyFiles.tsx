'use client';

import { PathContext } from '@/app/providers';
import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import './style.css';
import { setMyFiles, setMyFolders, setMyOpenedFolder, setMyPath } from '@/libs/redux/my-files.reducer';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

export type TFoldersList = TFolder[];

export type TFolderChildren = {
    folders: TFolder[];
    files: TFile[];
    currentPath: TPath[];
};

function handleFolderDelete(folder: TFolder) {
    const yes = prompt('You want to remove this file first in TRASH BIN?:');

    if (yes === 'yes') {
        fetcher.deleteFolder(folder.id, true).then(({ folder }) => {
            console.log(folder);
        });
    } else {
        fetcher.deleteFolder(folder.id, false).then(({ folder }) => {
            console.log(folder);
        });
    }
}

export function MyFiles() {
    // const { openedFolder, setOpenedFolder } = useContext(PathContext);
    const { files, folders, path, openedFolder } = useAppSelector((state) => state.myFiles);
    console.log(openedFolder);
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
                    // onRename={}
                    // onDelete={}
                    />
                </Box>
            </div>
        </div>
    );
}
