import React, { useEffect, useRef, useState } from 'react';
import { TFile, TFolder, fetcher } from '@/libs/request';
import { List, ListItem } from '@mui/material';
import styles from './Browser.module.scss';
import Image from 'next/image';
import { ContextMenu } from '@/components';
import clsx from 'clsx';
import { TFolderChildren } from '@/app/files/my/page';

const FOLDER_IMG = '/folder.png';
const FILE_IMG = '/file.png';

interface IProps {
    files: TFile[];
    folders: TFolder[];
    openFolder: (folder: TFolder, info: TFolderChildren) => void;
}

export function Browser({ files, folders, openFolder }: IProps) {
    const contextMenuRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({
        position: { x: 0, y: 0 },
        toggled: false,
    });

    /** Selected files and folders */
    const [selectedFiles, setSelectedFiles] = useState<TFile[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<TFolder[]>([]);

    function handleContextMenu(e: React.MouseEvent, id: string) {
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
        function handler(e: React.MouseEvent) {
            if (contextMenuRef?.current) {
                if (!contextMenuRef.current.contains(e.target)) {
                    resetContextMenu();
                    resetSelection(); //can lead to some shit
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
                {folders.map((folder) => (
                    <ListItem
                        className={clsx(
                            styles.card,
                            selectedFolders.includes(folder)
                                ? styles.card__selected
                                : null
                        )}
                        key={folder.id}
                        onClick={(e) => {
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
                        onDoubleClick={() => {
                            fetcher.getChildren(folder.id).then((info) => {
                                openFolder(folder, info);
                            });
                        }}
                        onContextMenu={(e) => handleContextMenu(e, folder.id)}
                    >
                        <Image
                            src={FOLDER_IMG}
                            alt=""
                            className={styles.card__image}
                            width={100}
                            height={100}
                        />
                        {folder.name}
                    </ListItem>
                ))}

                {files.map((file) => (
                    <ListItem
                        className={clsx(
                            styles.card,
                            selectedFiles.includes(file)
                                ? styles.card__selected
                                : null
                        )}
                        key={file.id}
                        onClick={(e) => {
                            if (e.ctrlKey) {
                                if (selectedFiles.includes(file)) {
                                    setSelectedFiles([
                                        ...selectedFiles.filter(
                                            (item) => item !== file
                                        ),
                                    ]);
                                    console.log('!!!');
                                } else {
                                    setSelectedFiles([...selectedFiles, file]);
                                    console.log('???');
                                }
                            }
                        }}
                        onContextMenu={(e) => handleContextMenu(e, file.id)}
                    >
                        <Image
                            src={FILE_IMG}
                            alt=""
                            className={styles.card__image}
                            width={70}
                            height={80}
                        />
                        {file.name}
                    </ListItem>
                ))}
            </List>
            <ContextMenu
                contextMenuRef={contextMenuRef}
                toggled={contextMenu.toggled}
                positionX={contextMenu.position.x}
                positionY={contextMenu.position.y}
                // selectedFiles={selectedFiles}
                // selectedFolders={selectedFolders}
            />
        </>
    );
}
