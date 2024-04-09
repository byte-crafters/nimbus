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
    onFolderDelete: (folder: TFolder) => void;
}

export function Browser({ files, folders, openFolder }: IProps) {
    const contextMenuRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({
        position: { x: 0, y: 0 },
        toggled: false,
    });

    const [item, setItem] = useState<string | null>(null);

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

        setItem(id);
        console.log(id);
    }

    function resetContextMenu() {
        setContextMenu({
            position: { x: 0, y: 0 },
            toggled: false,
        });

        setItem(null);
    }

    useEffect(() => {
        function handler(e: React.MouseEvent) {
            if (contextMenuRef?.current) {
                if (!contextMenuRef.current.contains(e.target)) {
                    resetContextMenu();
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
                            folder.id == item ? styles.card__selected : null
                        )}
                        key={folder.id}
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
                            file.id == item ? styles.card__selected : null
                        )}
                        key={file.id}
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
                buttons={[
                    {
                        text: 'Delete',
                        onClick: () => console.log('Deleted'),
                    },
                    {
                        text: 'Rename',
                        onClick: () => console.log('Renamed'),
                    },
                ]}
            />
        </>
    );
}
