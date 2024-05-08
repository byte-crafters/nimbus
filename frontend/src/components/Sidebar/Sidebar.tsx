'use client';
import { Box, Button, Divider, Drawer, Stack, Toolbar } from '@mui/material';
import styles from './Sidebar.module.scss';
import { PropsWithChildren, useContext, useRef } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { fetcher } from '@/libs/request';
import { PathContext } from '@/app/layout-page';

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
                    startIcon={<UploadIcon />}
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
