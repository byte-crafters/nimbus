'use client';

import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser, SharedToggleGroup } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './SharedFiles.module.scss';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { setSharedFiles, setSharedFolders, setSharedOpenedFolder, setSharedPath } from '@/libs/redux/shared-files.reducer';
import path from 'path';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

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
    const { files, folders, path, openedFolder } = useAppSelector((state) => state.sharedFiles);

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
    }

    function openFolder(folder: TFolder) {
        if (folder) {
            console.log(folder);
            dispatch(setSharedOpenedFolder(folder));
            const folderId = folder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    dispatch(setSharedPath(currentPath));
                    dispatch(setSharedFolders(folders));
                    dispatch(setSharedFiles(files));
                    console.log(folders.length);
                });
        } else {
            updatePage();
        }
    }

    function handleVariantChange(newVariant: string) {
        setVariant(newVariant);
    }

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div>
                <div className={styles.topContainer}>
                    <Typography variant="h6">Shared files</Typography>
                    <SharedToggleGroup
                        variant={variant}
                        onClick={handleVariantChange}
                    />
                </div>
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
