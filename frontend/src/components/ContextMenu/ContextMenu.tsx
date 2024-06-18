'use client';
import { useOperations } from '@/hooks';
import { TFSItem, fetcher } from '@/libs/request';
import { Delete, Edit, Share } from '@mui/icons-material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
} from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';
import { MODAL_TYPE, useModalContext } from '../Modal/ModalProvider';
import styles from './ContextMenu.module.scss';

interface IProps {
    positionX: number;
    positionY: number;
    toggled: boolean;
    selectedItems: TFSItem[];
    contextMenuRef: any;
    onRename: (items: TFSItem[], name: string) => void;
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

    const showShareModal = () => {
        showModal(MODAL_TYPE.SHARE, {
            items: selectedItems,
            handler: () => {},
        });
    };

    const downloadFile = () => {
        for (const item of selectedItems) {
            if ('extension' in item) {
                Promise.all([
                    fetcher.downloadFile(item.id),
                    fetcher.getFileInfo(item.id),
                ]).then(([blob, fileInfo]) => {
                    console.log(blob, fileInfo);
                    if (blob != null) {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = fileInfo.name;
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
                    <MenuItem onClick={showShareModal}>
                        <ListItemIcon>
                            <Share fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Share</ListItemText>
                    </MenuItem>
                )}
                {canDownload && (
                    <MenuItem onClick={downloadFile}>
                        <ListItemIcon>
                            <RestoreFromTrashIcon fontSize="small" />
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
