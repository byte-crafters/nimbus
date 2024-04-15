import React, { useEffect, useRef, useState } from 'react';
import { TFile, TFolder, fetcher } from '@/libs/request';
import { List, ListItem } from '@mui/material';
import styles from './Browser.module.scss';
import Image from 'next/image';
import { ContextMenu } from '@/components';
import clsx from 'clsx';
import { TFolderChildren } from '@/app/files/my/page';
import { BrowserItem } from './components/BrowserItem';
import { StringDialog } from '../StringDialog';
import { MODAL_TYPE, useModalContext } from '../Modal/ModalProvider';

const FOLDER_IMG = '/folder.png';
const FILE_IMG = '/file.png';

interface IProps {
    files: TFile[];
    folders: TFolder[];
    openFolder: (folder: TFolder, info: TFolderChildren) => void;
}

export function Browser({ files, folders, openFolder }: IProps) {
    const contextMenuRef = useRef<any>(null);
    const [contextMenu, setContextMenu] = useState({
        position: { x: 0, y: 0 },
        toggled: false,
    });

    /** Selected files and folders */
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<TFolder[]>([]);

    function handleContextMenu(e: React.MouseEvent) {
        e.preventDefault();

        const contextMenuAttr = contextMenuRef.current?.getBoundingClientRect();
        console.log(contextMenuAttr);

        const isLeft = e.clientX < window?.innerWidth / 2;
        let x = e.clientX - contextMenuAttr.width,
            y = e.clientY - 15;

        if (isLeft) {
            x = e.clientX;
        }

        setContextMenu({
            position: { x, y },
            toggled: true,
        });
    }

    function resetContextMenu() {
        setContextMenu({
            position: { x: 0, y: 0 },
            toggled: false,
        });
    }

    function resetSelection() {
        setSelectedFiles([]);
        setSelectedFolders([]);
    }

    useEffect(() => {
        function handler(e: any): void {
            if (contextMenuRef?.current) {
                if (!contextMenuRef.current?.contains(e.target)) {
                    resetContextMenu();
                    resetSelection();
                }
            }
        }

        document.addEventListener('click', handler);

        return () => {
            document.removeEventListener('click', handler);
        };
    });

    return (
        <>
            <List className={styles.container}>
                {folders.map((folder) => {
                    const selected = selectedFolders.includes(folder);
                    return (
                        <BrowserItem
                            item={folder}
                            image={FOLDER_IMG}
                            selected={selected}
                            handleClick={(e) => {
                                if (e.ctrlKey) {
                                    if (selectedFolders.includes(folder)) {
                                        setSelectedFolders([
                                            ...selectedFolders.filter(
                                                (item) => item !== folder
                                            ),
                                        ]);
                                    } else {
                                        setSelectedFolders([
                                            ...selectedFolders,
                                            folder,
                                        ]);
                                    }
                                }
                            }}
                            handleDoubleClick={() => {
                                fetcher.getChildren(folder.id).then((info) => {
                                    openFolder(folder, info);
                                });
                            }}
                            handleContextMenu={(e) => {
                                if (!selected) {
                                    setSelectedFolders([folder]);
                                    setSelectedFiles([]);
                                }
                                handleContextMenu(e);
                            }}
                            key={folder.id}
                        />
                    );
                })}

                {files.map((file) => {
                    const selected = selectedFiles.includes(file);
                    return (
                        <BrowserItem
                            item={file}
                            image={FILE_IMG}
                            selected={selected}
                            handleClick={(e) => {
                                if (e.ctrlKey) {
                                    if (selectedFiles.includes(file)) {
                                        setSelectedFiles([
                                            ...selectedFiles.filter(
                                                (item) => item !== file
                                            ),
                                        ]);
                                    } else {
                                        setSelectedFiles([
                                            ...selectedFiles,
                                            file,
                                        ]);
                                    }
                                }
                            }}
                            handleContextMenu={(e) => {
                                if (!selected) {
                                    setSelectedFiles([file]);
                                    setSelectedFolders([]);
                                }
                                handleContextMenu(e);
                            }}
                            key={file.id}
                        />
                    );
                })}
            </List>
            <ContextMenu
                contextMenuRef={contextMenuRef}
                toggled={contextMenu.toggled}
                positionX={contextMenu.position.x}
                positionY={contextMenu.position.y}
                files={selectedFiles}
                folders={selectedFolders}
            />
        </>
    );
}
