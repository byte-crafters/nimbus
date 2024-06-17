'use client';
import { setMyFiles, setMyFolders } from '@/libs/redux/my-files.reducer';
import { useAppDispatch, useAppSelector } from '@/libs/redux/store';
import {
    setTrashFiles,
    setTrashFolders,
} from '@/libs/redux/trash-files.reducer';
import { TFSItem, TFile, TFolder } from '@/libs/request';
import { FileMenu } from '@/shared/FileMenu/FileMenu';
import { List, Menu } from '@mui/material';
import React, { PropsWithChildren, useRef, useState } from 'react';
import styles from './Browser.module.scss';
import { InfoBar } from './components';
import { BrowserItem } from './components/BrowserItem';

interface IPosition {
    x: number;
    y: number;
}

interface IBrowserProps {
    files: TFile[];
    folders: TFolder[];
    openFolder: (folder: TFolder) => void;
    restoreGroup?: boolean;
    defaultGroup?: boolean;
    shareGroup?: boolean;
}

export function Browser({
    files,
    folders,
    openFolder,
    restoreGroup,
    defaultGroup,
    shareGroup,
}: PropsWithChildren<IBrowserProps>) {
    const [selectedItems, setSelectedItems] = useState<TFSItem[]>([]);
    const dispatch = useAppDispatch();

    const { value: searchValue } = useAppSelector(({ search }) => search);

    function handleRename(items: TFSItem[], name: string) {
        let newItem: TFolder | null | TFile = null;
        const newFolders = [],
            newFiles = [];
        const item = items[0];

        if ('extension' in item) {
            for (const file of files) {
                if (file.id == item.id) {
                    newItem = { ...file };
                    newItem.name = name;
                    newFiles.push(newItem);
                } else {
                    newFiles.push(file);
                }
            }

            dispatch(setMyFiles(newFiles));
        } else {
            for (const folder of folders) {
                if (folder.id == item.id) {
                    newItem = { ...folder };
                    newItem.name = name;
                    newFolders.push(newItem);
                } else {
                    newFolders.push(folder);
                }
            }

            dispatch(setMyFolders(newFolders));
        }

        handleClose();
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
        setSelectedItems([]);
        handleClose();
    }

    function handleDeleteRestore(items: TFSItem[]) {
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

        dispatch(setTrashFiles(newFiles));
        dispatch(setTrashFolders(newFolders));
        setSelectedItems([]);
        handleClose();
    }

    const [position, setPosition] = useState<IPosition | null>(null);
    const open = Boolean(position);

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClose = () => {
        setPosition(null);
    };

    const filtered =
        searchValue.toLowerCase().trim() === ''
            ? [...folders, ...files]
            : [
                  ...folders.filter((f) =>
                      f.name.toLowerCase().includes(searchValue.toLowerCase())
                  ),
                  ...files.filter((f) =>
                      f.name.toLowerCase().includes(searchValue.toLowerCase())
                  ),
              ];

    return (
        <>
            <div className={`${styles.container} browser_container`}>
                <div
                    className={`${styles.listContainer} browserList_container`}
                >
                    <List className={styles.list}>
                        {filtered.map((item) => {
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
                </div>
                <InfoBar items={selectedItems} />
                <Menu
                    open={open}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={{
                        left: position?.x ?? 0,
                        top: position?.y ?? 0,
                    }}
                >
                    <FileMenu
                        selectedItems={selectedItems}
                        onRename={handleRename}
                        onDelete={handleDelete}
                        onDeleteRestore={handleDeleteRestore}
                        defaultGroup={defaultGroup}
                        restoreGroup={restoreGroup}
                        shareGroup={shareGroup}
                    />
                </Menu>
            </div>
        </>
    );
}
