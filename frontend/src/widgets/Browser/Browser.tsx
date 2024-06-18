'use client';
import { useAppSelector } from '@/libs/redux/store';
import { TFSItem, TFile, TFolder } from '@/libs/request';
import { FileMenu } from '@/shared/FileMenu/FileMenu';
import { Box, List, Menu, Typography } from '@mui/material';
import React, { PropsWithChildren, useState } from 'react';
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
    onRename?: (items: TFSItem[], name: string) => void;
    onDelete?: (items: TFSItem[]) => void;
    onDeleteRestore?: (items: TFSItem[]) => void;
    restoreGroup?: boolean;
    defaultGroup?: boolean;
    shareGroup?: boolean;
}

export function Browser({
    files,
    folders,
    openFolder,
    onRename,
    onDelete,
    onDeleteRestore,
    restoreGroup,
    defaultGroup,
    shareGroup,
}: PropsWithChildren<IBrowserProps>) {
    const [selectedItems, setSelectedItems] = useState<TFSItem[]>([]);

    const { value: searchValue } = useAppSelector(({ search }) => search);

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
            <div className={styles.container}>
                <div className={styles.listContainer}>
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
                        {filtered.length == 0 && (
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="body2" textAlign="center">
                                    No Files
                                </Typography>
                            </Box>
                        )}
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
                        onRename={onRename}
                        onDelete={onDelete}
                        onDeleteRestore={onDeleteRestore}
                        defaultGroup={defaultGroup}
                        restoreGroup={restoreGroup}
                        shareGroup={shareGroup}
                        onMenuClose={handleClose}
                    />
                </Menu>
            </div>
        </>
    );
}
