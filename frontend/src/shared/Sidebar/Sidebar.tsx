'use client';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, Stack, Toolbar } from '@mui/material';
import { PropsWithChildren, useRef } from 'react';
import styles from './Sidebar.module.scss';
import Link from 'next/link';
import { Link as MUILink } from '@mui/material';

interface IProps {
    onCreateFolder: () => void;
    onUploadFile: (data: FormData) => void;
}

export const Sidebar = ({
    onCreateFolder,
    onUploadFile,
}: PropsWithChildren<IProps>) => {
    const filesInput = useRef<HTMLInputElement>(null);

    return (
        <Toolbar className={styles.drawer}>
            <Stack direction="column" spacing={2}>
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
                    variant="contained"
                    color="secondary"
                    endIcon={<CreateNewFolderIcon />}
                    onClick={onCreateFolder}
                >
                    Create
                </Button>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    color="secondary"
                    endIcon={<UploadIcon />}
                >
                    Upload
                    <input
                        style={{
                            clip: 'rect(0 0 0 0)',
                            clipPath: 'inset(50%)',
                            height: 1,
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            whiteSpace: 'nowrap',
                            width: 1,
                        }}
                        ref={filesInput}
                        type="file"
                        name="files"
                        multiple
                        onChange={() => {
                            const data = new FormData();

                            for (const file of filesInput.current!.files!) {
                                data.append('files', file, file.name);
                            }
                            onUploadFile(data);
                        }}
                    ></input>
                </Button>
            </Stack>
        </Toolbar>
    );
};
