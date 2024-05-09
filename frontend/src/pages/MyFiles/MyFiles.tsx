'use client';

import { PathContext, ProfileContext } from '@/app/providers';
import { Browser } from '@/components';
import { Sidebar } from '@/components/Sidebar';
import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
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
    const [showFoldersList, setShowFolders] = useState<TFoldersList>([]);
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
                fetcher.getChildren(folderId).then(({ folders, files }) => {
                    setShowFolders(folders);
                    setFiles(files);
                });
            }
        }
    }, [loggedUser]);

    useEffect(() => {
        if (openedFolder === null) {
            fetcher.getUserRootFolder().then(({ folders }) => {
                setShowFolders(folders);
            });
        } else {
            const folderId = openedFolder.id;
            fetcher.getChildren(folderId).then(({ folders, currentPath }) => {
                setShowFolders(folders);
                setPath(currentPath);
            });
        }
    }, []);

    function openFolder(folder: TFolder, info: TFolderChildren) {
        const { folders, files, currentPath } = info;

        setShowFolders(folders);
        setOpenedFolder?.(folder);
        setFiles(files);
        setPath(currentPath);
    }

    function handleRename(item: TFSItem, name: string) {
        //folder

        let newItem: TFolder = null,
            arr = [];

        for (let i = 0; i < showFoldersList.length; i++) {
            if (showFoldersList[i].id == item.id) {
                newItem = showFoldersList[i];
                newItem.name = name;
                arr.push(newItem);
            } else {
                arr.push(showFoldersList[i]);
            }
        }

        setShowFolders(arr);
    }

    function handleDelete(items: TFSItem[]) {
        let newFiles: TFile[] = [],
            newFolders: TFolder[] = [];

        for (let i = 0; i < showFoldersList.length; i++) {
            if (!items.find((item) => item.id == showFoldersList[i].id)) {
                newFolders.push(showFoldersList[i]);
            }
        }

        for (let i = 0; i < files.length; i++) {
            if (!items.find((item) => item.id == files[i].id)) {
                newFiles.push(files[i]);
            }
        }

        setFiles(newFiles);
        setShowFolders(newFolders);
    }

    function handleCreateFolder() {
        const folderName = prompt('Folder name:');

        if (folderName !== null) {
            const parentFolderId = openedFolder!.id;

            fetcher
                .postCreateFolder(folderName, parentFolderId)
                .then(({ folders }) => {
                    setShowFolders(folders);
                });
        }
    }

    function handleFileUpload(data: FormData) {
        if (openedFolder) {
            fetcher
                .uploadFiles(data, openedFolder?.id)
                .then(({ folders, currentFolder, files }) => {
                    setFiles(files);
                    setShowFolders(folders);
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
                <Breadcrumbs
                    sx={{ margin: 2 }}
                    aria-label="breadcrumb"
                    separator={<NavigateNextIcon fontSize="small" />}
                >
                    {path ? (
                        path.map((item, index) => (
                            <div
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const folderId = item.id;
                                    fetcher
                                        .getChildren(folderId)
                                        .then(
                                            ({
                                                folders,
                                                files,
                                                currentPath,
                                            }) => {
                                                setShowFolders(folders);
                                                setOpenedFolder?.(folderId); //fix that
                                                setFiles(files);
                                                setPath(currentPath);
                                                console.log(currentPath);
                                            }
                                        );
                                }}
                                key={item.id}
                            >
                                {index ? item.name : 'Home'}
                            </div>
                        ))
                    ) : (
                        <div>Home</div>
                    )}
                </Breadcrumbs>

                <Box sx={{ margin: 2 }}>
                    <Browser
                        items={[...showFoldersList, ...files]}
                        openFolder={openFolder}
                        onRename={handleRename}
                        onDelete={handleDelete}
                    />
                </Box>
            </div>
        </div>
    );
}
