'use client';
import {
    setMyFiles,
    setMyFolders,
    setMyOpenedFolder,
    setMyPath,
} from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { TFSItem, TFile, TFolder, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser } from '@/widgets';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ActiveDropzone } from '../../shared/ActiveDropzone/ActiveDropzone';
import styles from './MyFiles.module.scss';

export function MyFiles() {
    const [dropzoneActive, setDropzoneActive] = useState(false);
    const browserContainerRef = useRef<HTMLDivElement>(null);

    const { files, folders, path, openedFolder } = useAppSelector(
        ({ myFiles }) => myFiles
    );
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

            dispatch(setMyFiles(newFiles));
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

            dispatch(setMyFolders(newFolders));
        }

        // handleClose();
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

        dispatch(setMyFiles(newFiles));
        dispatch(setMyFolders(newFolders));
        // setSelectedItems([]);
        // handleClose();
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

        // dispatch(setTrashFiles(newFiles));
        // dispatch(setTrashFolders(newFolders));
        // setSelectedItems([]);
        // handleClose();
    }

    return (
        <div className={styles.myFiles_container}>
            <Typography variant="h6">My files</Typography>
            <Breadcrumbs list={path} onClick={openFolder} />
            <div
                className={styles.myFiles_activeZone}
                ref={browserContainerRef}
            >
                <ActiveDropzone
                    active={dropzoneActive}
                    setActive={setDropzoneActive}
                    ref={browserContainerRef}
                />
                {!dropzoneActive && (
                    <Browser
                        files={files}
                        folders={folders}
                        openFolder={openFolder}
                        onRename={handleRename}
                        onDelete={handleDelete}
                        defaultGroup
                    />
                )}
            </div>
        </div>
    );
}
