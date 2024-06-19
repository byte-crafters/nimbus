'use client';
import { setMyFolders } from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { fetcher } from '@/libs/request';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { Button, Stack, Toolbar } from '@mui/material';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { AttachFilesControl } from '../AttachFilesControl/AttachFilesControl';
import styles from './Sidebar.module.scss';
import { usePathname } from 'next/navigation';
import { setSharedFolders } from '@/libs/redux/shared-files.reducer';

interface IProps {}

export const Sidebar = ({}: PropsWithChildren<IProps>) => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const { openedFolder } =
        pathname == '/files/shared'
            ? useAppSelector((state) => state.sharedFiles)
            : useAppSelector((state) => state.myFiles);

    function handleCreateFolder() {
        const folderName = prompt('Folder name:');

        if (folderName !== null) {
            const parentFolderId = openedFolder!.id;

            fetcher
                .postCreateFolder(folderName, parentFolderId)
                .then(({ folders }) => {
                    if (pathname == '/files/shared') {
                        dispatch(setSharedFolders(folders));
                    } else {
                        dispatch(setMyFolders(folders));
                    }
                });
        }
    }

    return (
        <Toolbar className={styles.drawer}>
            <Stack direction="column" spacing={2} className={styles.sidebar}>
                <AttachFilesControl />
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
