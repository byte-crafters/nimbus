'use client';
import { setMyFiles, setMyFolders, setMyOpenedFolder } from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { fetcher } from '@/libs/request';
import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import { PropsWithChildren, useContext } from 'react';
import { UploadedFilesContext } from '../UploadFilesProvider/UploadFilesProvider';
import styles from './LoadedFiles.module.scss';

interface IProps { }

export const LoadedFiles = ({ }: PropsWithChildren<IProps>) => {
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

    const uploadFileInBox = (e: React.MouseEvent<HTMLElement>) => {
        const data = new FormData();

        for (const file of files) {
            data.append('files', file, file.name);
        }

        onUploadFile(data);
        setFilesLoaded([]);
    };

    return (
        <>
            {files.length === 0 ? null :
                <div className={styles.loadedFilesContainer}>
                    <div className={styles.loadedFiles}>
                        {
                            files.map((f, index) => {
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                        <div>
                                            {f.name}
                                        </div>
                                        <div onClick={() => onFileRemoveFromCandidates(f)}>x</div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <Button
                        className={styles.buttonUpload}
                        variant="contained"
                        color="secondary"
                        endIcon={<UploadIcon />}
                        onClick={uploadFileInBox}
                    >
                        Upload
                    </Button>
                </div>
            }
        </>
    );
};
