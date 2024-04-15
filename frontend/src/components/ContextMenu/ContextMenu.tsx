import React, { PropsWithChildren, useEffect, useState } from 'react';
import { TFile, TFolder, fetcher } from '@/libs/request';
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
    folders: TFolder[];
    files: TFile[];
    contextMenuRef: any;
}

export const ContextMenu = ({
    positionX,
    positionY,
    toggled,
    contextMenuRef,
    files,
    folders,
}: PropsWithChildren<IProps>) => {
    const { canDelete, canRename, canDownload, canShare } = useOperations(
        files,
        folders
    );
    const [showRename, setShowRename] = useState(false);

    function handleSmth() {
        console.log('smth');
    }

    useEffect(() => {
        if (folders.length == 1) {
            setShowRename(true);
        } else {
            setShowRename(false);
        }
    }, [files, folders]);

    const { showModal } = useModalContext();

    const showRenameModal = () => {
        showModal(MODAL_TYPE.RENAME, {
            items: files.length > folders.length ? files[0] : folders[0],
        });
    };

    // const showDeleteModal = () => {
    //     showModal(MODAL_TYPE.DELETE, {
    //         items: files.length > folders.length ? files[0] : folders[0]
    //     });
    // };

    return (
        <>
            <MenuList
                style={{ top: positionY, left: positionX }}
                ref={contextMenuRef}
                className={styles['container' + (toggled ? '__visible' : '')]}
            >
                {showRename && canRename && (
                    <MenuItem onClick={handleSmth}>
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
                    <MenuItem onClick={handleSmth}>
                        <ListItemIcon>
                            <Download fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Download</ListItemText>
                    </MenuItem>
                )}
                {canDelete && (
                    <>
                        <Divider variant="middle" />
                        <MenuItem onClick={handleSmth}>
                            <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    </>
                )}
            </MenuList>
        </>
    );
};
