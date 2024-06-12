'use client';
import { ContextMenu } from '@/components';
import { setMyFiles, setMyFolders } from '@/libs/redux/my-files.reducer';
import { useAppDispatch } from '@/libs/redux/store';
import { TFSItem, TFile, TFolder } from '@/libs/request';
import { List } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Browser.module.scss';
import { InfoBar } from './components';
import { BrowserItem } from './components/BrowserItem';

interface IBrowserProps {
    files: TFile[];
    folders: TFolder[];
    openFolder: (folder: TFolder) => void;
    // onRename: (items: TFSItem[], name: string) => void;
    // onDelete: (items: TFSItem[]) => void;
}

export function Browser({ files, folders, openFolder }: IBrowserProps) {
    const contextMenuRef = useRef<any>(null);
    const [contextMenu, setContextMenu] = useState({
        position: { x: 0, y: 0 },
        toggled: false,
    });

    const [selectedItems, setSelectedItems] = useState<TFSItem[]>([]);
    // const { files, folders, path } = useAppSelector((state) => state.myFiles);
    const dispatch = useAppDispatch();

    function handleRename(items: TFSItem[], name: string) {
        let newItem: TFolder | null = null;
        const newFolders = [];
        const item = items[0];

        for (const folder of folders) {
            if (folder.id == item.id) {
                newItem = folder;
                newItem.name = name;
                newFolders.push(newItem);
            } else {
                newFolders.push(folder);
            }
        }

        dispatch(setMyFolders(newFolders));
    }

    function handleDelete(items: TFSItem[]) {
        let newFiles: TFile[] = [],
            newFolders: TFolder[] = [];

        for (let i = 0; i < folders.length; i++) {
            if (!items.find((item) => item.id == folders[i].id)) {
                newFolders.push(folders[i]);
            }
        }

        for (let i = 0; i < files.length; i++) {
            if (!items.find((item) => item.id == files[i].id)) {
                newFiles.push(files[i]);
            }
        }

        dispatch(setMyFiles(newFiles));
        dispatch(setMyFolders(newFolders));
    }

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
        setSelectedItems([]);
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
            <div className={styles.container}>
                <List className={styles.list}>
                    {[...folders, ...files].map((item) => {
                        const selected = selectedItems.includes(item);
                        return (
                            <BrowserItem
                                item={item}
                                selected={selected}
                                handleClick={(e) => {
                                    if (e.ctrlKey) {
                                        if (selectedItems.includes(item)) {
                                            setSelectedItems([
                                                ...selectedItems.filter(
                                                    (i) => i !== item
                                                ),
                                            ]);
                                        } else {
                                            setSelectedItems([
                                                ...selectedItems,
                                                item,
                                            ]);
                                        }
                                    } else {
                                        setSelectedItems([item]);
                                    }
                                }}
                                handleDoubleClick={() => {
                                    if ('extension' in item === false) {
                                        openFolder(item);
                                    } else {
                                        item;
                                    }
                                }}
                                handleContextMenu={(e) => {
                                    if (!selected) {
                                        setSelectedItems([item]);
                                    }
                                    handleContextMenu(e);
                                }}
                                key={item.id}
                            />
                        );
                    })}
                </List>
                <InfoBar items={selectedItems} />
                <ContextMenu
                    contextMenuRef={contextMenuRef}
                    toggled={contextMenu.toggled}
                    positionX={contextMenu.position.x}
                    positionY={contextMenu.position.y}
                    selectedItems={selectedItems}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />
            </div>
        </>
    );
}
