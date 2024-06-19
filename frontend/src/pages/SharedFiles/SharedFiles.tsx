'use client';

import {
    setSharedFiles,
    setSharedFolders,
    setSharedOpenedFolder,
    setSharedPath,
} from '@/libs/redux/shared-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
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

    useEffect(() => {
        if (openedFolder !== null) {
            const folderId = openedFolder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    dispatch(setSharedPath(currentPath));
                    dispatch(setSharedFiles(files));
                    dispatch(setSharedFolders(folders));
                });
        } else {
            updatePage()
        }
    }, [openedFolder]);

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
        if (!folder || !folder.id || !folder.name) {
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

    function handleRename(items: TFSItem[], name: string) {
        let newItem: TFolder | null | TFile = null;
        const newFolders = [],
            newFiles = [];
        const item = items[0];

        if ('extension' in item) {
            for (const file of files) {
                if (file.id == item.id) {
                    newItem = { ...file };
                    newItem.name = name;
                    newFiles.push(newItem);
                } else {
                    newFiles.push(file);
                }
            }

            dispatch(setSharedFiles(newFiles));
        } else {
            for (const folder of folders) {
                if (folder.id == item.id) {
                    newItem = { ...folder };
                    newItem.name = name;
                    newFolders.push(newItem);
                } else {
                    newFolders.push(folder);
                }
            }

            dispatch(setSharedFolders(newFolders));
        }
    }
    function handleDelete(items: TFSItem[]) {
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

        dispatch(setSharedFiles(newFiles));
        dispatch(setSharedFolders(newFolders));
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
                    onRename={handleRename}
                    onDelete={handleDelete}
                    shareType={variant}
                    defaultGroup
                    shareGroup
                />
            </Box>
        </div>
    );
}
