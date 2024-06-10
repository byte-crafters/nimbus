'use client';

import { PathContext, ProfileContext } from '@/app/providers';
import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser, SharedToggleGroup } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './SharedFiles.module.scss';

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
    const { openedFolder, setOpenedFolder } = useContext(PathContext);


    const [folders, setFolders] = useState<TFoldersList>([]);
    const [files, setFiles] = useState<TFile[]>([]);
    const [path, setPath] = useState<TPath[]>([]);

    const [variant, setVariant] = useState<string>(VARIANT.MINE);


    useEffect(() => {
        updatePage();
    }, [variant]);

    function updatePage() {
        if (variant == VARIANT.MINE) {
            fetcher.getMySharedFolders().then((folders) => {
                setFolders(folders);
            });
            fetcher.getMySharedFiles().then((files) => {
                setFiles(files);
            });
        } else {
            fetcher.getSharedWithMeFolders().then((folders) => {
                setFolders(folders);
            });
            fetcher.getSharedWithMeFiles().then((files) => {
                setFiles(files);
            });
        }
    }

    function openFolder(folder: TFolder) {
        if (folder) {
            console.log(folder);
            setOpenedFolder?.(folder);
            const folderId = folder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    setPath(currentPath);
                    setFolders(folders);
                    setFiles(files);
                    console.log(folders.length);
                });
        } else {
            updatePage();
        }
    }

    function handleRename(item: TFSItem, name: string) {
        //folder

        let newItem: TFolder | null = null,
            arr = [];

        for (let i = 0; i < folders.length; i++) {
            if (folders[i].id == item.id) {
                newItem = folders[i];
                newItem.name = name;
                arr.push(newItem);
            } else {
                arr.push(folders[i]);
            }
        }

        setFolders(arr);
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

        setFiles(newFiles);
        setFolders(newFolders);
    }

    function handleCreateFolder() {
        const folderName = prompt('Folder name:');

        if (folderName !== null) {
            const parentFolderId = openedFolder!.id;

            fetcher
                .postCreateFolder(folderName, parentFolderId)
                .then(({ folders }) => {
                    setFolders(folders);
                });
        }
    }

    function handleFileUpload(data: FormData) {
        if (openedFolder) {
            fetcher
                .uploadFiles(data, openedFolder?.id)
                .then(({ folders, currentFolder, files }) => {
                    setFiles(files);
                    setFolders(folders);
                    setOpenedFolder?.(currentFolder);
                });
        }
    }

    function handleVariantChange(newVariant: string) {
        setVariant(newVariant);
    }

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* <Sidebar
                onCreateFolder={handleCreateFolder}
                onUploadFile={handleFileUpload}
            /> */}
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
                        // onRename={handleRename}
                        // onDelete={handleDelete}
                    />
                </Box>
            </div>
        </div>
    );
}
