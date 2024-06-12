'use client';
import { setMyFolders } from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { fetcher } from '@/libs/request';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { Button, Stack, Toolbar } from '@mui/material';
import Link from 'next/link';
import {
    PropsWithChildren
} from 'react';
import { Dropzone } from '../Dropzone/Dropzone';
import styles from './Sidebar.module.scss';
import './main.css';

interface IProps {}

export const Sidebar = ({}: PropsWithChildren<IProps>) => {
    const dispatch = useAppDispatch();
    const { openedFolder } = useAppSelector((state) => state.myFiles);
    
    function handleCreateFolder() {
        const folderName = prompt('Folder name:');

        if (folderName !== null) {
            const parentFolderId = openedFolder!.id;

            fetcher
                .postCreateFolder(folderName, parentFolderId)
                .then(({ folders }) => {
                    dispatch(setMyFolders(folders));
                });
        }
    }

    return (
        <Toolbar className={styles.drawer}>
            <Stack direction="column" spacing={2}>
                <Dropzone />
                {/* <Stack direction="column" spacing={2} className={styles.sidebar}>
                <div
                    className={[
                        'dropzone',
                        'square',
                        dropzoneActive ? 'dropzone__dragover' : undefined,
                    ]
                        .join(' ')
                        .trim()}
                    id="dropzone"
                    onClick={() => {
                        filesInput.current?.click();
                    }}
                    ref={dropzoneRef}
                    onDrop={onDrop}
                    onDragOver={(e: DragEvent<HTMLElement>) => {}}
                >
                    {filesLoaded.map((f, index) => {
                        return (
                            <div className="dropzone_item" key={index}>
                                {f.name}
                            </div>
                        );
                    })}
                </div>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<CreateNewFolderIcon />}
                    onClick={uploadFileInBox}
                >
                    Upload DND
                </Button> */}
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<CreateNewFolderIcon />}
                    onClick={() => handleCreateFolder()}
                >
                    Create
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    LinkComponent={Link}
                    href="/files/my"
                >
                    My files
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    LinkComponent={Link}
                    href="/files/shared"
                >
                    Shared files
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    LinkComponent={Link}
                    href="/files/bin"
                >
                    Recycle bin
                </Button>
                <Button
                    variant="text"
                    color="secondary"
                    LinkComponent={Link}
                    href="/files/storage"
                >
                    Storage
                </Button>
            </Stack>
        </Toolbar>
    );
};
