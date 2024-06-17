'use client';

import {
    setSharedFiles,
    setSharedFolders,
    setSharedOpenedFolder,
    setSharedPath,
} from '@/libs/redux/shared-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser, SharedToggleGroup } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './SharedFiles.module.scss';

export type TFoldersList = TFolder[];

export type TFolderChildren = {
    folders: TFolder[];
    files: TFile[];
    currentPath: TPath[];
};

export const VARIANT = {
    MINE: '1',
    OTHERS: '2',
};

export function SharedFiles() {
    const [variant, setVariant] = useState<string>(VARIANT.MINE);
    const { files, folders, path, openedFolder } = useAppSelector(
        (state) => state.sharedFiles
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        updatePage();
    }, [variant]);

    function updatePage() {
        if (variant == VARIANT.MINE) {
            fetcher.getMySharedFolders().then((folders) => {
                dispatch(setSharedFolders(folders));
            });
            fetcher.getMySharedFiles().then((files) => {
                console.log(files);
                dispatch(setSharedFiles(files));
            });
        } else {
            fetcher.getSharedWithMeFolders().then((folders) => {
                dispatch(setSharedFolders(folders));
            });
            fetcher.getSharedWithMeFiles().then((files) => {
                dispatch(setSharedFiles(files));
            });
        }
        dispatch(setSharedPath([{}]));
    }

    function openFolder(folder: TFolder) {
        console.log(folder);
        if (!folder || !folder.id) {
            updatePage();
        } else {
            console.log(folder);
            dispatch(setSharedOpenedFolder(folder));
            const folderId = folder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    const path = currentPath;
                    path[0].id = '';
                    dispatch(setSharedPath(path));
                    dispatch(setSharedFolders(folders));
                    dispatch(setSharedFiles(files));
                });
        }
    }

    function handleVariantChange(newVariant: string) {
        setVariant(newVariant);
    }

    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <Typography variant="h6">Shared files</Typography>
                <SharedToggleGroup
                    variant={variant}
                    onClick={handleVariantChange}
                />
            </div>
            <Breadcrumbs list={path} onClick={openFolder} />
            <Box className={styles.browserContainer}>
                <Browser
                    files={files}
                    folders={folders}
                    openFolder={openFolder}
                    defaultGroup
                    shareGroup
                />
            </Box>
        </div>
    );
}
