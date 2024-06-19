'use client';
import {
    setMyFiles,
    setMyFolders,
    setMyOpenedFolder,
} from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { fetcher } from '@/libs/request';
import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import { MouseEvent, PropsWithChildren, useContext } from 'react';
import { UploadedFilesContext } from '../UploadFilesProvider/UploadFilesProvider';
import styles from './LoadedFiles.module.scss';
import { IconButton, List, ListItem, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {}

export const LoadedFiles = ({}: PropsWithChildren<IProps>) => {
    const { openedFolder } = useAppSelector((state) => state.myFiles);
    const dispatch = useAppDispatch();

    const [files, setFilesLoaded] = useContext(UploadedFilesContext);

    function onFileRemoveFromCandidates(file: File) {
        setFilesLoaded((prevFilesLoaded) => {
            const newFiles = [];

            for (const f of prevFilesLoaded) {
                if (f !== file) {
                    newFiles.push(f);
                }
            }

            return newFiles;
        });
    }

    function onUploadFile(data: FormData) {
        if (openedFolder) {
            fetcher
                .uploadFiles(data, openedFolder?.id)
                .then(({ folders, currentFolder, files }) => {
                    dispatch(setMyFiles(files));
                    dispatch(setMyFolders(folders));
                    dispatch(setMyOpenedFolder(currentFolder));
                });
        }
    }

    const uploadFileInBox = (e: MouseEvent<HTMLElement>) => {
        const data = new FormData();

        for (const file of files) {
            data.append('files', file, file.name);
        }

        onUploadFile(data);
        setFilesLoaded([]);
    };

    return (
        <>
            {files.length === 0 ? null : (
                <>
                    <Button
                        className={styles.buttonUpload}
                        variant="contained"
                        color="secondary"
                        endIcon={<UploadIcon />}
                        onClick={uploadFileInBox}
                    >
                        Add
                    </Button>
                    <div className={styles.loadedFilesContainer}>
                        <List className={styles.loadedFiles}>
                            {files.map((f, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            padding: 0,
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {f.name}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            className={styles.buttonClose}
                                            aria-label="delete"
                                            onClick={() =>
                                                onFileRemoveFromCandidates(f)
                                            }
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                </>
            )}
        </>
    );
};
