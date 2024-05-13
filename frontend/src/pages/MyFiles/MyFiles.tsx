'use client';

import { PathContext, ProfileContext } from '@/app/providers';
import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Sidebar } from '@/shared';
import { Breadcrumbs, Browser } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

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
            console.log('RENAMED');
            console.log(folder);
        });
    } else {
        fetcher.deleteFolder(folder.id, false).then(({ folder }) => {
            console.log('RENAMED');
            console.log(folder);
        });
    }

    // if (newName !== null && newName.trim() !== '') {
    //     fetcher
    //         .renameFolder(folder.id, newName)
    //         .then(
    //             ({ folder }) => {
    //                 console.log('RENAMED');
    //                 console.log(folder);
    //             }
    //         );
    // }
}

export function MyFiles() {
    const { openedFolder, setOpenedFolder } = useContext(PathContext);
    const { loggedUser } = useContext(ProfileContext);

    const [folders, setFolders] = useState<TFoldersList>([]);
    const [files, setFiles] = useState<TFile[]>([]);
    const [path, setPath] = useState<TPath[]>(null);

    const router = useRouter();

    const filesInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        /**
         * TODO: move this logic in template or layout
         */
        if (loggedUser === null) {
            router.push('/login');
        } else {
            if (openedFolder) {
                const folderId = openedFolder.id;
                fetcher
                    .getChildren(folderId)
                    .then(({ currentPath, folders, files }) => {
                        setPath(currentPath);
                        setFolders(folders);
                        setFiles(files);
                    });
            }
        }
    }, [loggedUser]);

    useEffect(() => {
        if (openedFolder === null) {
            fetcher.getUserRootFolder().then(({ parentFolder }) => {
                if (setOpenedFolder) {
                    setOpenedFolder(parentFolder);
                }
            });
        }
    }, []);

    useEffect(() => {
        console.log(files);
    }, [files]);

    useEffect(() => {
        if (openedFolder) {
            const folderId = openedFolder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    setPath(currentPath);
                    setFolders(folders);
                    setFiles(files);
                    console.log(currentPath);
                });
        }
    }, [openedFolder]);

    function openFolder(folder: TFolder) {
        setOpenedFolder?.(folder);
    }

    function handleRename(items: TFSItem[], name: string) {
        let newItem: TFolder = null,
            arr = [],
            item = items[0];

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

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <Sidebar
                onCreateFolder={handleCreateFolder}
                onUploadFile={handleFileUpload}
            />
            <div>
                <Typography variant="h6">My files</Typography>
                <Breadcrumbs list={path} onClick={openFolder} />
                <Box sx={{ margin: 2 }}>
                    <Browser
                        items={[...folders, ...files]}
                        openFolder={openFolder}
                        onRename={handleRename}
                        onDelete={handleDelete}
                    />
                </Box>
            </div>
        </div>
    );
}
