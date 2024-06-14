'use client';
import {
    setMyFiles,
    setMyFolders,
    setMyOpenedFolder,
    setMyPath,
} from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import { TFolder, fetcher } from '@/libs/request';
import { Breadcrumbs, Browser } from '@/widgets';
import { Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ActiveDropzone } from '../../shared/ActiveDropzone/ActiveDropzone';
import './style.css';

export function MyFiles() {
    const [dropzoneActive, setDropzoneActive] = useState(false);
    const browserContainerRef = useRef<HTMLDivElement>(null);

    const { files, folders, path, openedFolder } = useAppSelector(({ myFiles }) => myFiles);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (openedFolder !== null) {
            const folderId = openedFolder!.id;
            fetcher
                .getChildren(folderId)
                .then(({ currentPath, folders, files }) => {
                    dispatch(setMyPath(currentPath));
                    dispatch(setMyFiles(files));
                    dispatch(setMyFolders(folders));
                });
        } else {
            fetcher.getUserRootFolder().then(({ parentFolder }) => {
                dispatch(setMyOpenedFolder(parentFolder));
            });
        }
    }, [openedFolder]);

    function openFolder(folder: TFolder) {
        dispatch(setMyOpenedFolder(folder));
    }

    return (
        <div
            className="myFiles_container"
            style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
        >
            <Typography variant="h6">My files</Typography>
            <Breadcrumbs list={path} onClick={openFolder} />
            <div className="myFiles_activeZone" ref={browserContainerRef}>
                <ActiveDropzone
                    active={dropzoneActive}
                    setActive={setDropzoneActive}
                    ref={browserContainerRef}
                />
                {dropzoneActive
                    ? null
                    : <Browser
                        files={files}
                        folders={folders}
                        openFolder={openFolder}
                    />
                }
            </div>

        </div>
    );
}
