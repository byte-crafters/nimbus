'use client';
import React, { useEffect, useRef, useState } from 'react';
import { TFSItem, TFile, TFolder, fetcher } from '@/libs/request';
import { List, ListItem } from '@mui/material';
import styles from './Browser.module.scss';
import Image from 'next/image';
import { ContextMenu } from '@/components';
import clsx from 'clsx';
import { TFolderChildren } from '@/app/files/my/page';
import { BrowserItem } from './components/BrowserItem';
import { StringDialog } from '../StringDialog';
import { MODAL_TYPE, useModalContext } from '../Modal/ModalProvider';

interface IProps {
    items: TFSItem[];
    openFolder: (folder: TFolder, info: TFolderChildren) => void;
    onRename: (item: TFSItem, name: string) => void;
    onDelete: (items: TFSItem[]) => void;
}

export function Browser({ items, openFolder, onRename, onDelete }: IProps) {
    const contextMenuRef = useRef<any>(null);
    const [contextMenu, setContextMenu] = useState({
        position: { x: 0, y: 0 },
        toggled: false,
    });

    const [selectedItems, setSelectedItems] = useState<TFSItem[]>([]);

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
            <List className={styles.container}>
                {items.map((item) => {
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
                                }
                            }}
                            handleDoubleClick={() => {
                                if (!item?.extension)
                                    fetcher
                                        .getChildren(item.id)
                                        .then((info) => {
                                            openFolder(item, info);
                                        });
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
            <ContextMenu
                contextMenuRef={contextMenuRef}
                toggled={contextMenu.toggled}
                positionX={contextMenu.position.x}
                positionY={contextMenu.position.y}
                selectedItems={selectedItems}
                onRename={onRename}
                onDelete={onDelete}
            />
        </>
    );
}
