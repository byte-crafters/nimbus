import React, { PropsWithChildren, useState } from 'react';
import { TFile, TFolder, fetcher } from '@/libs/request';
import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Typography,
} from '@mui/material';
import styles from './ContextMenu.module.scss';
import Image from 'next/image';
import { Delete, Download, Edit, Share } from '@mui/icons-material';
import clsx from 'clsx';
import { useOperations } from '@/hooks';

interface IProps {
    // rightClickItem: any;
    positionX: number;
    positionY: number;
    toggled: boolean;
    contextMenuRef: any;
}

export type ContextMenuItem = {
    id: string;
    caption: string;
};

export const ContextMenu = ({
    // rightClickItem,
    positionX,
    positionY,
    toggled,
    contextMenuRef,
}: PropsWithChildren<IProps>) => {
    const { canDelete, canRename, canDownload, canShare } = useOperations(
        null,
        null
    ); //drop files here

    function handleSmth() {
        console.log('smth');
    }

    // useEffect(() => {
    //     /** Rename - only if 1 file */

    // }, [selectedFiles, selectedFolders])

    return (
        <MenuList
            style={{ top: positionY, left: positionX }}
            ref={contextMenuRef}
            className={styles['container' + (toggled ? '__visible' : '')]}
        >

            {canRename && (
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
    );
};
