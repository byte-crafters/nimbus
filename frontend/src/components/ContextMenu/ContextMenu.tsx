'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { TFSItem, TFile, TFolder, fetcher } from '@/libs/request';
import {
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
} from '@mui/material';
import styles from './ContextMenu.module.scss';
import { Delete, Download, Edit, Share } from '@mui/icons-material';
import { useOperations } from '@/hooks';
import { StringDialog } from '../StringDialog';
import { MODAL_TYPE, useModalContext } from '../Modal/ModalProvider';

interface IProps {
    positionX: number;
    positionY: number;
    toggled: boolean;
    selectedItems: TFSItem[];
    contextMenuRef: any;
    onRename: (item: TFSItem, name: string) => void;
    onDelete: (items: TFSItem[]) => void;
}

export const ContextMenu = ({
    positionX,
    positionY,
    toggled,
    contextMenuRef,
    selectedItems,
    onRename,
    onDelete,
}: PropsWithChildren<IProps>) => {
    const { canDelete, canRename, canDownload, canShare } =
        useOperations(selectedItems);
    const [showRename, setShowRename] = useState(false);

    function handleSmth() {
        console.log('smth');
    }

    useEffect(() => {
        if (selectedItems.length == 1) {
            setShowRename(true);
        } else {
            setShowRename(false);
        }
    }, [selectedItems]);

    const { showModal } = useModalContext();

    const showRenameModal = () => {
        showModal(MODAL_TYPE.RENAME, {
            items: selectedItems,
            handler: onRename,
        });
    };

    const showDeleteModal = () => {
        showModal(MODAL_TYPE.DELETE, {
            items: selectedItems,
            handler: onDelete,
        });
    };

    const downloadFile = () => {
        for (const item of selectedItems) {
            if (item?.extension) {
                Promise.all([
                    fetcher.downloadFile(item.id),
                    fetcher.getFileInfo(item.id),
                ]).then(([blob, fileInfo]) => {
                    console.log(blob, fileInfo);
                    if (blob != null) {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = 'temp+' + fileInfo.name;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                });
            }
        }
    };

    return (
        <>
            <MenuList
                style={{ top: positionY, left: positionX }}
                ref={contextMenuRef}
                className={styles['container' + (toggled ? '__visible' : '')]}
            >
                {showRename && canRename && (
                    <MenuItem onClick={showRenameModal}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Rename</ListItemText>
                    </MenuItem>
                )}
                {canShare && (
                    <MenuItem onClick={handleSmth}>
                        <ListItemIcon>
                            <Share fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Share</ListItemText>
                    </MenuItem>
                )}
                {canDownload && (
                    <MenuItem onClick={downloadFile}>
                        <ListItemIcon>
                            <Download fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Download</ListItemText>
                    </MenuItem>
                )}
                {canDelete && (
                    <div>
                        <Divider variant="middle" />
                        <MenuItem onClick={showDeleteModal}>
                            <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    </div>
                )}
            </MenuList>
        </>
    );
};
