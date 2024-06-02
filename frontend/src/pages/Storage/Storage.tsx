'use client';

import { PathContext, ProfileContext } from '@/app/providers';
import { TFSItem, TFile, TFolder, TPath, fetcher } from '@/libs/request';
import { Sidebar } from '@/shared';
import { Breadcrumbs, Browser, SharedToggleGroup } from '@/widgets';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import styles from './Storage.module.scss';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

export type TFoldersList = TFolder[];

export type TFolderChildren = {
    folders: TFolder[];
    files: TFile[];
    currentPath: TPath[];
};

export function Storage() {
    const { openedFolder, setOpenedFolder } = useContext(PathContext);
    const { loggedUser } = useContext(ProfileContext);

    const [folders, setFolders] = useState<TFoldersList>([]);
    const [files, setFiles] = useState<TFile[]>([]);
    const [path, setPath] = useState<TPath[]>(null);

    const router = useRouter();

    const filesInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        updatePage();
    }, []);

    useEffect(() => {
        /**
         * TODO: move this logic in template or layout
         */
        if (loggedUser === null) {
            router.push('/login');
        }
    }, [loggedUser]);

    useEffect(() => {
        // if (openedFolder) {
        //     const folderId = openedFolder!.id;
        //     fetcher
        //         .getChildren(folderId)
        //         .then(({ currentPath, folders, files }) => {
        //             setPath(currentPath);
        //             setFolders(folders);
        //             setFiles(files);
        //             console.log(folders.length);
        //         });
        // } else {
        //     updatePage();
        // }
    }, [openedFolder]);

    function updatePage() {
        fetcher.getDeletedFolders().then((folders) => {
            setFolders(folders);
            console.log(folders);
        });
        fetcher.getDeletedFiles().then((files) => {
            setFiles(files);
            console.log(files);
        });
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

        let newItem: TFolder = null,
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

    const data = [
        { value: 35, label: 'Text files' },
        { value: 10, label: 'Images' },
        { value: 5, label: 'Archives' },
        { value: 20, label: 'Other' },
    ];

    const size = {
        width: 400,
        height: 300,
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <Sidebar
                onCreateFolder={handleCreateFolder}
                onUploadFile={handleFileUpload}
            />
            <div>
                <Typography variant="h6">Storage</Typography>
                <Box
                    sx={{
                        margin: 2,
                        width: 900,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <PieChart
                        series={[
                            {
                                innerRadius: 14,
                                outerRadius: 100,
                                paddingAngle: 0,
                                cornerRadius: 10,
                                startAngle: -87,
                                endAngle: 180,
                                cx: 150,
                                cy: 150,
                                data,
                            },
                        ]}
                        {...size}
                    />
                    <Typography variant="h6">
                        70% of storage used (3584 MB of 5 GB)
                    </Typography>
                    <Typography variant="body1">
                        Make room for your photos, files, and more by cleaning
                        up space
                    </Typography>
                </Box>
            </div>
        </div>
    );
}
