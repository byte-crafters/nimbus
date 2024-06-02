'use client';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, Stack, Toolbar } from '@mui/material';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import styles from './Sidebar.module.scss';
// import stylesDropzone from './styles.module.css';
import Link from 'next/link';
import './main.css';
import { Link as MUILink } from '@mui/material';

import { DragEvent } from 'react';

interface IProps {
    onCreateFolder: () => void;
    onUploadFile: (data: FormData) => void;
}

export const Sidebar = ({
    onCreateFolder,
    onUploadFile,
}: PropsWithChildren<IProps>) => {
    const filesInput = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);

    const [filesLoaded, setFilesLoaded] = useState<File[]>([]);
    const [dropzoneActive, setDropzoneActive] = useState(false);

    function addFile(file: File) {
        setFilesLoaded((prev) => {
            const newState = [...prev, file];
            console.log(newState);
            return newState;
        });
    }

    useEffect(() => {
        if (dropzoneRef.current) {
            dropzoneRef.current.addEventListener('dragenter', (e) => {
                e.preventDefault();

                setDropzoneActive(true)
            });

            dropzoneRef.current.addEventListener('dragleave', (e) => {
                e.preventDefault();

                setDropzoneActive(false)
            });

            dropzoneRef.current.addEventListener('dragover', (e) => {
                /** Need to preventDefault to let `drop` event fire */
                e.preventDefault();
            });
        }

        // TODO: clear
    });

    const uploadFileInBox = (e: React.MouseEvent<HTMLElement>) => {
        const data = new FormData();

        for (const file of filesLoaded) {
            data.append('files', file, file.name);
        }

        onUploadFile(data);
    };

    const onDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();

        console.log(e.dataTransfer.items);
        // console.log(e.dataTransfer.files[0].name!)

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...e.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file !== null) {
                        console.log(file);
                        console.log(`… file[${i}].name = ${file!.name}`);

                        addFile(file);
                    }
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...e.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
            });
        }

        setDropzoneActive(false);
        console.log('DROPY')
    };

    const onAddFileManually = () => {
        for (const file of filesInput.current!.files!) {
            addFile(file);
        }
    };

    return (
        <Toolbar className={styles.drawer}>
            <Stack direction="column" spacing={2}>
                <div
                    className={["dropzone", dropzoneActive ? "dropzone__dragover" : undefined].join(' ').trim()}
                    id="dropzone"
                    onClick={() => {
                        filesInput.current?.click();
                    }}
                    ref={dropzoneRef}
                    onDrop={onDrop}
                    onDragOver={(e: DragEvent<HTMLElement>) => { }}
                >
                    {filesLoaded.map((f, index) => {
                        return (
                            <div
                                className="dropzone_item"
                                key={index}
                            >
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
                        onChange={onAddFileManually}
                    ></input>
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
