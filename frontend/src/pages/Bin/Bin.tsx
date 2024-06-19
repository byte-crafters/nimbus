'use client';

import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import {
    setTrashFiles,
    setTrashFolders,
    setTrashPath,
} from '@/libs/redux/trash-files.reducer';
import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import styles from './Bin.module.scss';

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

        fetcher.getDeletedFiles().then((files) => {
            console.log(files);
            dispatch(setTrashFiles(files));
        });
        dispatch(setTrashPath([{}]));
    }

    function openFolder(folder: TFolder) {
        // if (!folder || !folder.id) {
        //     updatePage();
        // } else {
        //     dispatch(setTrashFolders(folder));
        //     const folderId = folder!.id;
        //     fetcher
        //         .getChildren(folderId)
        //         .then(({ currentPath, folders, files }) => {
        //             const path = currentPath;
        //             path[0].id = '';
        //             dispatch(setTrashPath(path));
        //             dispatch(setTrashFolders(folders));
        //             dispatch(setTrashFiles(files));
        //         });
        // }
    }

    function handleDeleteRestore(items: TFSItem[]) {
        let newFiles: TFile[] = [],
            newFolders: TFolder[] = [];

        for (let i = 0; i < folders.length; i++) {
            if (!items.find((item) => item.id == folders[i].id)) {
                newFolders.push(folders[i]);
            }
        }

        for (let i = 0; i < files.length; i++) {
            if (!items.find((item) => item.id == files[i].id)) {
                newFiles.push(files[i]);
            }
        }

        dispatch(setTrashFiles(newFiles));
        dispatch(setTrashFolders(newFolders));
    }

    return (
        <div className={styles.container}>
            <Typography variant="h6">Recycle bin</Typography>
            <Breadcrumbs list={path} onClick={openFolder} />
            <Box className={styles.browserContainer}>
                <Browser
                    files={files}
                    folders={folders}
                    openFolder={openFolder}
                    onDeleteRestore={handleDeleteRestore}
                    restoreGroup
                />
            </Box>
        </div>
    );
}
